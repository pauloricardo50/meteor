/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import { expect } from 'chai';
import fetch from 'node-fetch';

import { REST_API_ERRORS } from '../restApiConstants';
import RESTAPI from '../RESTAPI';
import { withMeteorUserId } from '../helpers';

const API_PORT = process.env.CIRCLE_CI ? 3000 : 4106;

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

Meteor.methods({
  apiTestMethod() {
    return this.userId;
  },
});

describe('RESTAPI', () => {
  let user;
  let apiToken;

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
    apiToken = Random.id(24);
    user = Factory.create('user', { apiToken });
  });

  context('returns an error when', () => {
    it('endpoint path is unknown', () =>
      fetchAndCheckResponse({
        url: '/unknown_endpoint',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.apiToken}`,
          },
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
            Authorization: `Bearer ${user.apiToken}`,
          },
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

    it('token is wrong', () =>
      fetchAndCheckResponse({
        url: '/test',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 12345',
          },
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
          Authorization: `Bearer ${user.apiToken}`,
        },
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
          Authorization: `Bearer ${user.apiToken}`,
        },
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
          Authorization: `Bearer ${user.apiToken}`,
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
          Authorization: `Bearer ${user.apiToken}`,
        },
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
          Authorization: `Bearer ${user.apiToken}`,
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
          Authorization: `Bearer ${user.apiToken}`,
        },
      },
      expectedResponse: '',
    }));
});
