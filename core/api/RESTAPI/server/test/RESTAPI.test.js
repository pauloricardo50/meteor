/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import { REST_API_ERRORS } from '../restApiConstants';
import RESTAPI from '../RESTAPI';
import { withMeteorUserId } from '../helpers';
import {
  fetchAndCheckResponse,
  makeBody,
  makeHeaders,
  getTimestampAndNonce,
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
    return this.userId;
  },
});

describe.only('RESTAPI', () => {
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
  api.addEndpoint('/method', 'POST', ({ user: { _id: userId }, body: {payload} }) =>
    withMeteorUserId(
      userId,
      () =>
        new Promise((resolve, reject) =>
          Meteor.call('apiTestMethod', (err, res) =>
            (err ? reject(err) : resolve(`${res} ${payload}`)))),
    ));

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
      const query = getTimestampAndNonce();
      return fetchAndCheckResponse({
        url: '/unknown_endpoint',
        query,
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey, privateKey, query }),
        },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/unknown_endpoint',
          method: 'POST',
        }),
        status: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/unknown_endpoint',
          method: 'POST',
        }).status,
      });
    });

    it('endpoint method is unknown', () => {
      const query = getTimestampAndNonce();
      return fetchAndCheckResponse({
        url: '/test',
        query,
        data: {
          method: 'PATCH',
          headers: makeHeaders({ publicKey, privateKey, query }),
        },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/test',
          method: 'PATCH',
        }),
        status: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/test',
          method: 'PATCH',
        }).status,
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
        status: REST_API_ERRORS.WRONG_CONTENT_TYPE('plain/text').status,
      }));

    it('authorization type is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        expectedResponse: REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE,
        status: REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE.status,
      }));

    it('public key is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey: '12345' }),
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
        status: REST_API_ERRORS.AUTHORIZATION_FAILED.status,
      }));

    it('signature is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey }),
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
        status: REST_API_ERRORS.AUTHORIZATION_FAILED.status,
      }));

    it('attemps a replay attack with same nonce', () => {
      const query = getTimestampAndNonce();

      return fetchAndCheckResponse({
        url: '/test',
        query,
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey, privateKey, query }),
        },
        expectedResponse: makeTestRoute('POST')({ user }),
      }).then(() =>
        fetchAndCheckResponse({
          url: '/test',
          query,
          data: {
            method: 'POST',
            headers: makeHeaders({ publicKey, privateKey, query }),
          },
          expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
          status: REST_API_ERRORS.AUTHORIZATION_FAILED.status,
        }));
    });

    it('attemps a replay attack with old timestamp', () => {
      const query = {
        timestamp: (Math.round(new Date().valueOf() / 1000) - 32).toString(),
        nonce: '1hkfi57g',
      };
      return fetchAndCheckResponse({
        url: '/test',
        query,
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey, privateKey, query }),
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
        status: REST_API_ERRORS.AUTHORIZATION_FAILED.status,
      });
    });
  });

  it('can authenticate and get a response', () => {
    const query = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test',
      query,
      data: {
        method: 'POST',
        headers: makeHeaders({ publicKey, privateKey, query }),
      },
      expectedResponse: makeTestRoute('POST')({ user }),
    });
  });

  it('removes old nonces', () => {
    const query = {
      timestamp: Math.round(new Date().valueOf() / 1000).toString(),
      nonce: 'testNonce',
    };

    return fetchAndCheckResponse({
      url: '/test',
      query,
      data: {
        method: 'POST',
        headers: makeHeaders({ publicKey, privateKey, query }),
      },
      expectedResponse: makeTestRoute('POST')({ user }),
    });
  });

  it('can authenticate and get a response from a different method for the same endpoint', () => {
    const query = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test',
      query,
      data: {
        method: 'PUT',
        headers: makeHeaders({ publicKey, privateKey, query }),
      },
      expectedResponse: makeTestRoute('PUT')({ user }),
    });
  });

  it('returns an internal server error if the error is not a meteor.error', () => {
    const query = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test',
      query,
      data: {
        method: 'GET',
        headers: makeHeaders({ publicKey, privateKey, query }),
      },
      expectedResponse: { message: 'Internal server error', status: 500 },
      status: 500,
    });
  });

  it('displays the error if it is a meteor.error', () => {
    const query = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test',
      query,
      data: {
        method: 'DELETE',
        headers: makeHeaders({ publicKey, privateKey, query }),
      },
      expectedResponse: { message: '[meteor error]', status: 500 },
      status: 500,
    });
  });

  it('calls meteor methods with the right userId', () => {
    const query = getTimestampAndNonce();
    const body = { payload: 'test' };


    return fetchAndCheckResponse({
      url: '/method',
      query,
      data: {
        method: 'POST',
        headers: makeHeaders({ publicKey, privateKey, query, body }),
        body: JSON.stringify(body),
      },
      expectedResponse: `${user._id} test`,
    });
  });

  it('does not crash if undefined is returned by the endpoint', () => {
    const query = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/undefined',
      query,
      data: {
        method: 'GET',
        headers: makeHeaders({ publicKey, privateKey, query }),
      },
      expectedResponse: '',
    });
  });

  it('does not match sub endpoints', () => {
    const query = getTimestampAndNonce();

    return fetchAndCheckResponse({
      url: '/test/subtest',
      query,
      data: {
        method: 'POST',
        headers: makeHeaders({ publicKey, privateKey, query }),
      },
      expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
        path: '/api/test/subtest',
        method: 'POST',
      }),
      status: 404,
    });
  });
});
