/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fetch from 'node-fetch';
import startAPI from '..';
import { REST_API_ERRORS, HTTP_STATUS_CODES } from '../constants';

describe.only('RESTAPI', () => {
  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    }
  });
  const api = startAPI();
  api.connectHandlers({
    path: '/api/test',
    handler: (req, res) =>
      api.sendResponse({
        res,
        data: {
          statusCode: HTTP_STATUS_CODES.OK,
          body: {
            message: 'Test',
          },
        },
      }),
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
    it('endpoint is unknown', () =>
      fetchAndCheckResponse({
        url: 'http://localhost:4106/api/unknown_endpoint',
        data: { method: 'POST' },
        expectedResponse: REST_API_ERRORS.UNKNOWN_ENDPOINT('/api/unknown_endpoint'),
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
  });
});
