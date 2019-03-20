/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import { expect } from 'chai';
import fetch from 'node-fetch';
import NodeRSA from 'node-rsa';
import moment from 'moment';

import { sortObject } from 'core/api/helpers';
import { REST_API_ERRORS } from '../restApiConstants';
import RESTAPI from '../RESTAPI';
import { withMeteorUserId } from '../helpers';

const API_PORT = process.env.CIRCLE_CI ? 3000 : 4106;

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

const checkResponse = ({ res, expectedResponse, status = 200 }) => {
  expect(res.status).to.equal(status);

  return res.json().then((body) => {
    expect(body).to.deep.equal(expectedResponse);
  });
};

const fetchAndCheckResponse = ({ url, data, expectedResponse, status }) =>
  fetch(`http://localhost:${API_PORT}/api${url}`, data).then(res =>
    checkResponse({ res, expectedResponse, status }));

const signBody = (body) => {
  const key = new NodeRSA();
  key.importKey(privateKey.replace(/\r?\n|\r/g, ''), 'pkcs1-private-pem');

  const sortedBody = sortObject(body);

  const signature = key.sign(JSON.stringify(sortedBody), 'base64', 'utf8');
  return signature;
};

const generateBody = ({ timestampOverride, nonceOverride } = {}) => {
  const now = timestampOverride || moment().unix();
  const nonce = nonceOverride || Random.id(8);
  const body = { timestamp: now, nonce };
  const signature = signBody(body);
  return JSON.stringify({ ...body, signature });
};

Meteor.methods({
  apiTestMethod() {
    return this.userId;
  },
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
  api.addEndpoint('/method', 'GET', ({ user: { _id: userId } }) =>
    withMeteorUserId(
      userId,
      () =>
        new Promise((resolve, reject) =>
          Meteor.call('apiTestMethod', (err, res) =>
            (err ? reject(err) : resolve(res)))),
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
    it('endpoint path is unknown', () =>
      fetchAndCheckResponse({
        url: '/unknown_endpoint',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
          },
          body: generateBody(),
        },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/unknown_endpoint',
          method: 'POST',
        }),
        status: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/unknown_endpoint',
          method: 'POST',
        }).status,
      }));

    it('endpoint method is unknown', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
          },
          body: generateBody(),
        },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/test',
          method: 'PATCH',
        }),
        status: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/test',
          method: 'PATCH',
        }).status,
      }));

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
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 12345',
          },
          body: generateBody(),
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
        status: REST_API_ERRORS.AUTHORIZATION_FAILED.status,
      }));

    it('signature is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
          },
          body: JSON.stringify({ signature: '123' }),
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
        status: REST_API_ERRORS.AUTHORIZATION_FAILED.status,
      }));

    it('attemps a replay attack with same nonce', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
          },
          body: generateBody({ nonceOverride: 12345 }),
        },
        expectedResponse: makeTestRoute('POST')({ user }),
      }).then(() =>
        fetchAndCheckResponse({
          url: '/test',
          data: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
            },
            body: generateBody({ nonceOverride: 12345 }),
          },
          expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
          status: REST_API_ERRORS.AUTHORIZATION_FAILED.status,
        })));

      it('attemps a replay attack with old timestamp', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
          },
          body: generateBody({timestampOverride: moment().unix() - 31}),
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
        status: REST_API_ERRORS.AUTHORIZATION_FAILED.status,
      }));
  });

  it('can authenticate and get a response', () =>
    fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
        },
        body: generateBody(),
      },
      expectedResponse: makeTestRoute('POST')({ user }),
    }));

  it('can authenticate and get a response from a different method for the same endpoint', () =>
    fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
        },
        body: generateBody(),
      },
      expectedResponse: makeTestRoute('PUT')({ user }),
    }));

  it('returns an internal server error if the error is not a meteor.error', () =>
    fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
        },
      },
      expectedResponse: { message: 'Internal server error', status: 500 },
      status: 500,
    }));

  it('displays the error if it is a meteor.error', () =>
    fetchAndCheckResponse({
      url: '/test',
      data: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
        },
        body: generateBody(),
      },
      expectedResponse: { message: '[meteor error]', status: 500 },
      status: 500,
    }));

  it('calls meteor methods with the right userId', () =>
    fetchAndCheckResponse({
      url: '/method',
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
        },
      },
      expectedResponse: user._id,
    }));

  it('does not crash if undefined is returned by the endpoint', () =>
    fetchAndCheckResponse({
      url: '/undefined',
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
        },
      },
      expectedResponse: '',
    }));

  it('does not match sub endpoints', () =>
    fetchAndCheckResponse({
      url: '/test/subtest',
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicKey.replace(/\r?\n|\r/g, '')}`,
        },
        body: generateBody(),
      },
      expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
        path: '/api/test/subtest',
        method: 'POST',
      }),
      status: 404,
    }));
});
