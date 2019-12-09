/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import pick from 'lodash/pick';

import UserService from '../../../../users/server/UserService';
import { HTTP_STATUS_CODES } from '../../restApiConstants';
import RESTAPI from '../../RESTAPI';
import { testEndpointAPI } from '..';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';

let user;

const api = new RESTAPI();
api.addEndpoint('/test', 'POST', testEndpointAPI, {
  rsaAuth: true,
  endpointName: 'Test POST',
});
api.addEndpoint('/test', 'GET', testEndpointAPI, {
  rsaAuth: true,
  endpointName: 'Test GET',
});
api.addEndpoint('/test', 'PUT', testEndpointAPI, {
  rsaAuth: true,
  endpointName: 'Test PUT',
});
api.addEndpoint('/test', 'DELETE', testEndpointAPI, {
  rsaAuth: true,
  endpointName: 'Test DELETE',
});
api.addEndpoint('/test/:id', 'POST', testEndpointAPI, {
  rsaAuth: true,
  endpointName: 'Test POST with id',
});
api.addEndpoint('/test/:id', 'GET', testEndpointAPI, {
  rsaAuth: true,
  endpointName: 'Test GET with id',
});
api.addEndpoint('/test/:id', 'PUT', testEndpointAPI, {
  rsaAuth: true,
  endpointName: 'Test PUT with id',
});
api.addEndpoint('/test/:id', 'DELETE', testEndpointAPI, {
  rsaAuth: true,
  endpointName: 'Test DELETE with id',
});

const testEndpoint = ({
  id,
  body,
  query,
  expectedResponse,
  status,
  method,
}) => {
  const url = id ? `/test/${id}` : '/test';
  const { timestamp, nonce } = getTimestampAndNonce();
  return fetchAndCheckResponse({
    url,
    query,
    data: {
      method,
      headers: makeHeaders({
        userId: 'pro',
        timestamp,
        nonce,
        body,
        query,
      }),
      body: JSON.stringify(body),
    },
    expectedResponse,
    status,
  });
};

describe('REST: testEndpoint', function () {
  this.timeout(10000);

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
    const createdUser = Factory.create('pro', { _id: 'pro' });
    user = pick(
      UserService.get(createdUser._id, {
        emails: { address: 1, verified: 1 },
        firstName: 1,
        lastName: 1,
        phoneNumbers: 1,
      }),
      ['emails', 'firstName', 'lastName', 'phoneNumbers'],
    );
  });

  const testQuery = {
    param1: 'hello?this/is=cool',
    param2: '?yay!this/is=so#cool',
  };
  const testBody = {
    testString: 'hello',
    testNumber: 12345,
    testObject: {
      testNumberArray: [123, 456, 789],
      testBoolean: true,
    },
  };

  describe('returns the expected response with method', () => {
    context('GET', () => {
      it('without query', () =>
        testEndpoint({
          method: 'GET',
          expectedResponse: {
            user,
            body: {},
            query: {},
            params: {},
          },
          status: HTTP_STATUS_CODES.OK,
        }));

      it('with query', () =>
        testEndpoint({
          method: 'GET',
          query: testQuery,
          expectedResponse: {
            user,
            body: {},
            query: testQuery,
            params: {},
          },
          status: HTTP_STATUS_CODES.OK,
        }));

      it('with query and params', () =>
        testEndpoint({
          method: 'GET',
          query: testQuery,
          id: '123abc',
          expectedResponse: {
            user,
            body: {},
            query: testQuery,
            params: { id: '123abc' },
          },
          status: HTTP_STATUS_CODES.OK,
        }));
    });

    ['POST', 'PUT', 'DELETE'].forEach(method => {
      context(method, () => {
        it('without query and body', () =>
          testEndpoint({
            method,
            expectedResponse: {
              user,
              body: {},
              query: {},
              params: {},
            },
            status: HTTP_STATUS_CODES.OK,
          }));

        it('with query', () =>
          testEndpoint({
            method,
            query: testQuery,
            expectedResponse: {
              user,
              body: {},
              query: testQuery,
              params: {},
            },
            status: HTTP_STATUS_CODES.OK,
          }));

        it('with query and body', () =>
          testEndpoint({
            method,
            query: testQuery,
            body: testBody,
            expectedResponse: {
              user,
              body: testBody,
              query: testQuery,
              params: {},
            },
            status: HTTP_STATUS_CODES.OK,
          }));

        it('with query, body and params', () =>
          testEndpoint({
            method,
            query: testQuery,
            body: testBody,
            id: 'abc123',
            expectedResponse: {
              user,
              body: testBody,
              query: testQuery,
              params: { id: 'abc123' },
            },
            status: HTTP_STATUS_CODES.OK,
          }));
      });
    });
  });
});
