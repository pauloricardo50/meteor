/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { expect } from 'chai';
import omit from 'lodash/omit';

import { REST_API_ERRORS } from '../restApiConstants';
import RESTAPI from '../RESTAPI';
import {
  withMeteorUserId,
  OBJECT_FORMATS,
  isAPI,
  getAPIUser,
} from '../helpers';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
  signRequest,
} from './apiTestHelpers.test';

const publicKey = '-----BEGIN RSA PUBLIC KEY-----\n'
  + 'MEgCQQCGZse2vDomKwX42nV3ZwJsbw/RGzbtCoz00xnciiHvJOGn\n'
  + '79MDLQ93aXJVJb0YwqwYIqQHqJI/I1/2inD353lnAgMBAAE=\n'
  + '-----END RSA PUBLIC KEY-----';

const privateKey = '-----BEGIN RSA PRIVATE KEY-----\n'
  + 'MIIBOgIBAAJBAIZmx7a8OiYrBfjadXdnAmxvD9EbNu0KjPTTGdyKIe\n'
  + '8k4afv0wMtD3dpclUlvRjCrBgipAeokj8jX/aKcPfneWcCAwEAAQJA\n'
  + 'egy37A++Vo7XW4c3CPk4UDQDDwdBt7zPCDzzzTx7WGiqiQAX8aJiGS\n'
  + 'C0hxtSk6yKd+xvKuXJH/GUyauNeQ7s0QIhAPy4AYr5a5MFitDc0vwW\n'
  + 'um1e/tHm0/lhN2AiBS3pz8SrAiEAiCWB9yC93YpiggSoBRIbP5t5C9\n'
  + 'ThAKnYQsg1Sr5XRjUCIQDZNydMVnnaEqdwQn2uY7K1kzMfI3ILJT49\n'
  + 'iMA+6HrGpQIgMgJdB/Kt61eusYWWVi59ddLdFrx+XakFuBokgS0Dj9\n'
  + 'UCIHkPp3g9B6FVrUs3cC4QA5S2XP0YGhvAJ6FykArwjWYy\n'
  + '-----END RSA PRIVATE KEY-----';

const makeTestRoute = method => ({ user }) => ({
  message: method,
  userId: user && user._id,
});

Meteor.methods({
  apiTestMethod() {
    return new Promise(resolve => setTimeout(() => resolve(this.userId), 1500));
  },
  isAPI,
});

describe('RESTAPI', () => {
  let user;

  const api = new RESTAPI();
  api.addEndpoint('/test', 'POST', makeTestRoute('POST'));
  api.addEndpoint('/test', 'PUT', makeTestRoute('PUT'));
  api.addEndpoint('/test', 'GET', () => {
    throw new Error('secret error');
  });
  api.addEndpoint('/test', 'DELETE', () => {
    throw new Meteor.Error('meteor error');
  });
  api.addEndpoint('/undefined', 'GET', () => {});
  api.addEndpoint(
    '/method/:id/test',
    'POST',
    ({
      user: { _id: userId },
      body: { testBody },
      query: { testQuery },
      params: { id },
    }) =>
      withMeteorUserId(
        { userId },
        () =>
          new Promise((resolve, reject) =>
            Meteor.call('apiTestMethod', (err, res) =>
              (err
                ? reject(err)
                : resolve(`${res} ${testBody} ${testQuery} ${id}`)))),
      ),
  );

  api.addEndpoint('/isAPI', 'GET', () => ({ isAPI: isAPI() }));
  api.addEndpoint('/fiberAPIUser', 'GET', getAPIUser);

  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    } else {
      api.start();
    }
  });

  after(() => {
    api.reset();
  });

  beforeEach(() => {
    resetDatabase();
    user = Factory.create('user', {
      apiPublicKey: { publicKey: publicKey.replace(/\r?\n|\r/g, '') },
    });
  });

  context('returns an error when', () => {
    it('endpoint path is unknown', () => {
      const { timestamp, nonce } = getTimestampAndNonce();
      return fetchAndCheckResponse({
        url: '/unknown_endpoint',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
        },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/unknown_endpoint',
          method: 'POST',
        }),
      });
    });

    it('endpoint method is unknown', () => {
      const { timestamp, nonce } = getTimestampAndNonce();
      return fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'PATCH',
          headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
        },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/test',
          method: 'PATCH',
        }),
      });
    });

    it('content type is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: { 'Content-Type': 'plain/text' },
        },
        expectedResponse: REST_API_ERRORS.WRONG_CONTENT_TYPE('plain/text'),
      }));

    it('authorization type is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        expectedResponse: REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE,
      }));

    it('public key is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey: '12345' }),
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
      }));

    it('signature is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey }),
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
      }));

    it('attempts a replay attack with same nonce', () => {
      const { timestamp, nonce } = getTimestampAndNonce();

      return fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
        },
        expectedResponse: makeTestRoute('POST')({ user }),
      }).then(() =>
        fetchAndCheckResponse({
          url: '/test',
          data: {
            method: 'POST',
            headers: makeHeaders({
              publicKey,
              privateKey,
              timestamp: Math.round(new Date().valueOf() / 1000).toString(),
              nonce,
            }),
          },
          expectedResponse: REST_API_ERRORS.REPLAY_ATTACK_ATTEMPT,
        }));
    });

    it('attempts a replay attack with old timestamp', () => {
      const timestamp = (
        Math.round(new Date().valueOf() / 1000) - 32
      ).toString();
      const nonce = '1hkfi57g';

      return fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
        },
        expectedResponse: REST_API_ERRORS.REPLAY_ATTACK_ATTEMPT,
      });
    });
  });

  it('can authenticate and get a response', () => {
    const { timestamp, nonce } = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'POST',
        headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
      },
      expectedResponse: makeTestRoute('POST')({ user }),
    });
  });

  it('removes old nonces', () =>
    fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'POST',
        headers: makeHeaders({
          publicKey,
          privateKey,
          timestamp: Math.round(new Date().valueOf() / 1000).toString(),
          nonce: 'testNonce',
        }),
      },
      expectedResponse: makeTestRoute('POST')({ user }),
    }));

  it('can authenticate and get a response from a different method for the same endpoint', () => {
    const { timestamp, nonce } = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'PUT',
        headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
      },
      expectedResponse: makeTestRoute('PUT')({ user }),
    });
  });

  it('returns an internal server error if the error is not a meteor.error', () => {
    const { timestamp, nonce } = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'GET',
        headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
      },
      expectedResponse: { message: 'Internal server error', status: 500 },
    });
  });

  it('displays the error if it is a meteor.error', () => {
    const { timestamp, nonce } = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'DELETE',
        headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
      },
      expectedResponse: { message: '[meteor error]', status: 400 },
    });
  });

  it('calls meteor methods with the right userId', () => {
    const { timestamp, nonce } = getTimestampAndNonce();
    const body = { testBody: 'testBody' };
    const query = { testQuery: 'testQuery' };
    const id = 'testId';

    return fetchAndCheckResponse({
      url: `/method/${id}/test`,
      query,
      data: {
        method: 'POST',
        headers: makeHeaders({
          publicKey,
          privateKey,
          body,
          timestamp,
          nonce,
          query,
        }),
        body: JSON.stringify(body),
      },
      expectedResponse: `${user._id} testBody testQuery testId`,
    });
  });

  it('does not crash if undefined is returned by the endpoint', () => {
    const { timestamp, nonce } = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/undefined',
      data: {
        method: 'GET',
        headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
      },
      expectedResponse: '',
    });
  });

  it('does not match sub endpoints', () => {
    const { timestamp, nonce } = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test/subtest',
      data: {
        method: 'POST',
        headers: makeHeaders({
          publicKey,
          privateKey,
          timestamp,
          nonce,
        }),
      },
      expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
        path: '/api/test/subtest',
        method: 'POST',
      }),
    });
  });

  context('can authenticate when signature is performed on', () => {
    it('string only object', () => {
      const { timestamp, nonce } = getTimestampAndNonce();
      const query = {
        param1: 'hello?this/is=a-test',
        param2: '?yay!this/is/so#cool',
        'param-3': 1200000,
        'param-4': '1234',
      };
      const body = {
        testString: 'hello',
        testNumber: 12345,
        testObject: {
          testArray: ['test1', 'test2', null],
        },
        testBool: true,
        testEmptyObject: {},
        testEmptyArray: [],
        testEmptyString: '',
      };

      return fetchAndCheckResponse({
        url: '/test',
        query,
        data: {
          method: 'POST',
          headers: makeHeaders({
            publicKey,
            privateKey,
            timestamp,
            nonce,
            signature: signRequest({
              body,
              query,
              timestamp,
              nonce,
              privateKey,
              format: OBJECT_FORMATS.TO_STRING,
            }),
          }),
          body: JSON.stringify(body),
        },
        expectedResponse: makeTestRoute('POST')({ user }),
      });
    });

    it('literal only object', () => {
      const { timestamp, nonce } = getTimestampAndNonce();
      const query = {
        param1: 'hello?this/is=a-test',
        param2: '?yay!this/is/so#cool',
        'param-3': 1200000,
        'param-4': '1234',
      };
      const body = {
        testString: 'hello',
        testNumber: 12345,
        testObject: {
          testArray: ['test1', 'test2', null],
        },
        testBool: true,
        testEmptyObject: {},
        testEmptyArray: [],
        testEmptyString: '',
      };

      return fetchAndCheckResponse({
        url: '/test',
        query,
        data: {
          method: 'POST',
          headers: makeHeaders({
            publicKey,
            privateKey,
            timestamp,
            nonce,
            signature: signRequest({
              body,
              query,
              timestamp,
              nonce,
              privateKey,
              format: OBJECT_FORMATS.TO_LITERRAL,
            }),
          }),
          body: JSON.stringify(body),
        },
        expectedResponse: makeTestRoute('POST')({ user }),
      });
    });
  });

  describe('isAPI', () => {
    it('returns true for a function ran inside an API', () => {
      const { timestamp, nonce } = getTimestampAndNonce();
      const expectedResponse = { isAPI: true };
      return fetchAndCheckResponse({
        url: '/isAPI',
        data: {
          method: 'GET',
          headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
        },
        expectedResponse,
      });
    });

    it('returns false when calling a method', (done) => {
      Meteor.call('isAPI', (err, result) => {
        if (err) {
          done(err);
        }

        expect(result).to.equal(false);
        done();
      });
    });
  });

  describe('APIUser', () => {
    it('returns the logged in API user', () => {
      const { timestamp, nonce } = getTimestampAndNonce();
      const expectedResponse = omit(user, ['createdAt', 'updatedAt']);

      return fetchAndCheckResponse({
        url: '/fiberAPIUser',
        data: {
          method: 'GET',
          headers: makeHeaders({ publicKey, privateKey, timestamp, nonce }),
        },
        expectedResponse,
        include: true,
      });
    });
  });
});
