/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

import { expect } from 'chai';
import { appendFileSync } from 'fs';
import omit from 'lodash/omit';

import {
  flushFileUploadDir,
  makeFileUploadDir,
} from '../../../../utils/filesUtils';
import { resetDatabase } from '../../../../utils/testHelpers';
import {
  OBJECT_FORMATS,
  getAPIUser,
  getMatchingPathOptions,
  isAPI,
  withMeteorUserId,
} from '../helpers';
import RESTAPI from '../RESTAPI';
import {
  FILE_UPLOAD_DIR,
  HTTP_STATUS_CODES,
  REST_API_ERRORS,
} from '../restApiConstants';
import {
  fetchAndCheckResponse,
  getTimestampAndNonce,
  makeHeaders,
  signRequest,
  uploadFile,
} from './apiTestHelpers.test';

const publicKey =
  '-----BEGIN RSA PUBLIC KEY-----\n' +
  'MEgCQQCGZse2vDomKwX42nV3ZwJsbw/RGzbtCoz00xnciiHvJOGn\n' +
  '79MDLQ93aXJVJb0YwqwYIqQHqJI/I1/2inD353lnAgMBAAE=\n' +
  '-----END RSA PUBLIC KEY-----';

const privateKey =
  '-----BEGIN RSA PRIVATE KEY-----\n' +
  'MIIBOgIBAAJBAIZmx7a8OiYrBfjadXdnAmxvD9EbNu0KjPTTGdyKIe\n' +
  '8k4afv0wMtD3dpclUlvRjCrBgipAeokj8jX/aKcPfneWcCAwEAAQJA\n' +
  'egy37A++Vo7XW4c3CPk4UDQDDwdBt7zPCDzzzTx7WGiqiQAX8aJiGS\n' +
  'C0hxtSk6yKd+xvKuXJH/GUyauNeQ7s0QIhAPy4AYr5a5MFitDc0vwW\n' +
  'um1e/tHm0/lhN2AiBS3pz8SrAiEAiCWB9yC93YpiggSoBRIbP5t5C9\n' +
  'ThAKnYQsg1Sr5XRjUCIQDZNydMVnnaEqdwQn2uY7K1kzMfI3ILJT49\n' +
  'iMA+6HrGpQIgMgJdB/Kt61eusYWWVi59ddLdFrx+XakFuBokgS0Dj9\n' +
  'UCIHkPp3g9B6FVrUs3cC4QA5S2XP0YGhvAJ6FykArwjWYy\n' +
  '-----END RSA PRIVATE KEY-----';

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

describe('RESTAPI', function () {
  this.timeout(10000);
  let user;

  const api = new RESTAPI();
  api.addEndpoint('/test', 'POST', makeTestRoute('POST'), {
    rsaAuth: true,
    endpointName: 'Test POST',
  });
  api.addEndpoint('/test', 'PUT', makeTestRoute('PUT'), {
    rsaAuth: true,
    noAuth: true,
    basicAuth: true,
    endpointName: 'Test PUT',
  });
  api.addEndpoint(
    '/test',
    'GET',
    () => {
      throw new Error('secret error');
    },
    { rsaAuth: true, endpointName: 'Test GET' },
  );
  api.addEndpoint(
    '/test',
    'DELETE',
    () => {
      throw new Meteor.Error('meteor error');
    },
    { rsaAuth: true, endpointName: 'Test DELETE' },
  );
  api.addEndpoint('/undefined', 'GET', () => {}, {
    rsaAuth: true,
    endpointName: 'Test undefined',
  });
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
              err
                ? reject(err)
                : resolve(`${res} ${testBody} ${testQuery} ${id}`),
            ),
          ),
      ),
    { rsaAuth: true, endpointName: 'Test POST with id' },
  );
  api.addEndpoint('/multipart', 'POST', makeTestRoute('POST'), {
    multipart: true,
    endpointName: 'Test multipart',
  });

  api.addEndpoint('/isAPI', 'GET', () => ({ isAPI: isAPI() }), {
    rsaAuth: true,
    endpointName: 'Test isApi',
  });
  api.addEndpoint('/fiberAPIUser', 'GET', getAPIUser, {
    rsaAuth: true,
    endpointName: 'Test fiber API user',
  });

  before(function () {
    makeFileUploadDir();
    flushFileUploadDir();
    api.start();
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

    it('content type is wrong', () => {
      const { timestamp, nonce } = getTimestampAndNonce();

      return fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: {
            ...makeHeaders({ publicKey, privateKey, timestamp, nonce }),
            'Content-Type': 'plain/text',
          },
        },
        expectedResponse: REST_API_ERRORS.WRONG_CONTENT_TYPE(
          'plain/text',
          'application/json',
        ),
      });
    });

    it('authorization type is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        expectedResponse: REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE(
          'You tried to authenticate with no-auth but this endpoint does not allow it',
        ),
      }));

    it('public key is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey: '12345' }),
        },
        // expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
      }).then(response => {
        const { status, errorName, message, info } = response;
        expect(status).to.equal(HTTP_STATUS_CODES.FORBIDDEN);
        expect(errorName).to.equal('AUTHORIZATION_FAILED');
        expect(message).to.equal('Wrong public key or signature.');
        expect(info).to.equal(
          'No user found with this public key, or maybe it has a typo ?',
        );
      }));

    it('signature is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: makeHeaders({ publicKey }),
        },
      }).then(response => {
        const { status, errorName, message, info } = response;
        expect(status).to.equal(HTTP_STATUS_CODES.FORBIDDEN);
        expect(errorName).to.equal('AUTHORIZATION_FAILED');
        expect(message).to.equal('Wrong public key or signature.');
        expect(info).to.not.equal(undefined);
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
        }),
      );
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

  it('allows multipart/form-data requests on multipart endpoints', () => {
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    return uploadFile({
      filePath,
      userId: user._id,
      url: '/multipart',
    }).then(res => {
      const { userId } = res;
      expect(userId).to.equal(user._id);
    });
  });

  it('does not allow multipart/form-data requests on non multipart endpoints', () => {
    const filePath = `${FILE_UPLOAD_DIR}/myFile.txt`;
    appendFileSync(filePath, 'Hello');
    return uploadFile({
      filePath,
      userId: user._id,
      url: '/test',
    }).then(res => {
      const { status, errorName, info } = res;
      expect(status).to.equal(400);
      expect(errorName).to.equal('WRONG_AUTHORIZATION_TYPE');
      expect(info).to.include('multipart');
    });
  });

  context('getMatchingPathOptions', () => {
    it('returns the correct options for endpoint with no wildcard', () => {
      const options = {
        '/api/test': {
          POST: { options: { a: 1 } },
        },
      };

      const req = {
        _parsedUrl: { pathname: '/api/test' },
        method: 'POST',
      };

      const pathOptions = getMatchingPathOptions(req, options);
      expect(pathOptions).to.deep.equal({ a: 1 });
    });

    it('returns the correct options for endpoint with wildcards', () => {
      const options = {
        '/api/test/:wildcard1/:wildcard2': {
          POST: { options: { a: 1 } },
        },
      };

      const req = {
        _parsedUrl: { pathname: '/api/test/12345/abcdef' },
        method: 'POST',
      };

      const pathOptions = getMatchingPathOptions(req, options);
      expect(pathOptions).to.deep.equal({ a: 1 });
    });

    it('returns the correct options for request with queryString', () => {
      const options = {
        '/api/test': {
          POST: { options: { a: 1 } },
        },
      };

      const req = {
        _parsedUrl: { pathname: '/api/test/?test=1' },
        method: 'POST',
      };

      const pathOptions = getMatchingPathOptions(req, options);
      expect(pathOptions).to.deep.equal({ a: 1 });
    });

    it('returns no options for wrong request method ', () => {
      const options = {
        '/api/test': {
          POST: { options: { a: 1 } },
        },
      };

      const req = {
        _parsedUrl: { pathname: '/api/test' },
        method: 'GET',
      };

      const pathOptions = getMatchingPathOptions(req, options);
      expect(pathOptions).to.deep.equal({});
    });

    it('returns no options for wrong request endpoint ', () => {
      const options = {
        '/api/test': {
          POST: { options: { a: 1 } },
        },
      };

      const req = {
        _parsedUrl: { pathname: '/api' },
        method: 'POST',
      };

      const pathOptions = getMatchingPathOptions(req, options);
      expect(pathOptions).to.deep.equal({});
    });

    it('returns correct options for endpoints with and without wildcard ', () => {
      const options = {
        '/api/test': {
          POST: { options: { a: 1 } },
        },
        '/api/test/:wildcard1/:wildcard2': {
          POST: { options: { b: 1 } },
        },
      };

      const req1 = {
        _parsedUrl: { pathname: '/api/test' },
        method: 'POST',
      };

      const pathOptions1 = getMatchingPathOptions(req1, options);
      expect(pathOptions1).to.deep.equal({ a: 1 });

      const req2 = {
        _parsedUrl: { pathname: '/api/test/12345/abcdef' },
        method: 'POST',
      };

      const pathOptions2 = getMatchingPathOptions(req2, options);
      expect(pathOptions2).to.deep.equal({ b: 1 });
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

    it('returns false when calling a method', done => {
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
      const expectedResponse = omit(user, [
        'createdAt',
        'updatedAt',
        'roles',
        'isDisabled',
        'defaultBoardId',
        'isInRoundRobin',
        'status',
      ]);
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

  describe('Basic authentication', () => {
    it('can authenticate and get a response', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'PUT',
          headers: {
            'x-epotek-authorization': `EPOTEK-BASIC ${publicKey.replace(
              /\r?\n|\r/g,
              '',
            )}`,
          },
        },
      }).then(res => {
        const { message } = res;
        expect(message).to.contain('PUT');
      }));

    it('throws if public key is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'PUT',
          headers: {
            'x-epotek-authorization': `EPOTEK-BASIC 123`,
          },
        },
      }).then(res => {
        const { message } = res;
        expect(message).to.contain('Wrong public key');
      }));
  });

  describe('allows multiple authentication types', () => {
    it('using no-auth', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: { method: 'PUT' },
      }).then(res => {
        const { message } = res;
        expect(message).to.equal('PUT');
      }));

    it('using basic', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'PUT',
          headers: {
            'x-epotek-authorization': `EPOTEK-BASIC ${publicKey.replace(
              /\r?\n|\r/g,
              '',
            )}`,
          },
        },
      }).then(res => {
        const { message } = res;
        expect(message).to.equal('PUT');
      }));
  });
});
