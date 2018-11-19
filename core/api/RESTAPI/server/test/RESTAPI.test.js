/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import fetch from 'node-fetch';
import startAPI from '..';
import { Factory } from 'meteor/dburles:factory';
import { REST_API_ERRORS, HTTP_STATUS_CODES } from '../constants';

describe.only('RESTAPI', () => {
  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    }
  });

  let user;
  let apiToken;
  const api = startAPI();
  const responseData = req => ({
    statusCode: HTTP_STATUS_CODES.OK,
    body: {
      message: 'Test',
      userId: req.user && req.user._id,
    },
  });

  api.connectHandlers({
    method: 'POST',
    path: '/api/test',
    handler: (req, res) =>
      api.sendResponse({
        res,
        data: responseData(req),
      }),
  });

  beforeEach(() => {
    resetDatabase();
    apiToken = Random.id(24);
    user = Factory.create('user', { apiToken });
  });

  const checkResponse = ({ res, expectedResponse }) => {
    expect(res.status).to.equal(expectedResponse.statusCode);
    return res
      .json()
      .then(body => expect(body).to.deep.equal(expectedResponse.body));
  };

  const fetchAndCheckResponse = ({ url, data, expectedResponse }) =>
    fetch(url, data).then(res =>
      checkResponse({
        res,
        expectedResponse,
      }));

  describe('returns an error when', () => {
    it('endpoint path is unknown', () =>
      fetchAndCheckResponse({
        url: 'http://localhost:4106/api/unknown_endpoint',
        data: { method: 'POST' },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/unknown_endpoint',
          method: 'POST',
        }),
      }));

    it('endpoint method is unknown', () =>
      fetchAndCheckResponse({
        url: 'http://localhost:4106/api/test',
        data: { method: 'GET' },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT({
          path: '/api/test',
          method: 'GET',
        }),
      }));

    it('content type is wrong', () =>
      fetchAndCheckResponse({
        url: 'http://localhost:4106/api/test',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'plain/text',
          },
        },
        expectedResponse: REST_API_ERRORS.WRONG_CONTENT_TYPE('plain/text'),
      }));

    it('authorization type is wrong', () =>
      fetchAndCheckResponse({
        url: 'http://localhost:4106/api/test',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        expectedResponse: REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE,
      }));

    it('token is wrong', () =>
      fetchAndCheckResponse({
        url: 'http://localhost:4106/api/test',
        data: {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 12345',
          },
        },
        expectedResponse: REST_API_ERRORS.AUTHORIZATION_FAILED,
      }));
  });

  it('can authenticate', () =>
    fetchAndCheckResponse({
      url: 'http://localhost:4106/api/test',
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.apiToken}`,
        },
      },
      expectedResponse: responseData({ user }),
    }));

  it('receive a response', () => {
    const expectedResponse = {
      statusCode: HTTP_STATUS_CODES.OK,
      body: {
        message: 'Test2',
      },
    };
    api.connectHandlers({
      method: 'GET',
      path: '/api/test2',
      handler: (req, res) =>
        api.sendResponse({
          res,
          data: expectedResponse,
        }),
    });

    return fetchAndCheckResponse({
      url: 'http://localhost:4106/api/test2',
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.apiToken}`,
        },
      },
      expectedResponse,
    });
  });
});
