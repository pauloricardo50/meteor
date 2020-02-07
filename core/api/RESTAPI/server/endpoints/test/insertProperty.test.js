/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import PropertyService from '../../../../properties/server/PropertyService';
import generator from '../../../../factories';
import { PROPERTY_CATEGORY } from '../../../../properties/propertyConstants';
import {
  getTimestampAndNonce,
  fetchAndCheckResponse,
  makeHeaders,
} from '../../test/apiTestHelpers.test';
import RESTAPI from '../../RESTAPI';
import insertPropertyAPI from '../insertProperty';

const api = new RESTAPI();
api.addEndpoint('/properties', 'POST', insertPropertyAPI, {
  rsaAuth: true,
  endpointName: 'Insert property',
});

const insertProperty = ({
  body,
  expectedResponse,
  status,
  userId,
  impersonateUser,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const query = impersonateUser
    ? { 'impersonate-user': impersonateUser }
    : undefined;
  return fetchAndCheckResponse({
    url: '/properties',
    query,
    data: {
      method: 'POST',
      headers: makeHeaders({
        userId,
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

describe('REST: insertProperty', function() {
  this.timeout(10000);

  before(function() {
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
    generator({
      users: {
        _id: 'pro',
        _factory: 'pro',
        organisations: { _id: 'org1' },
        emails: [{ address: 'pro@org.com', verified: true }],
        proProperties: {
          _id: 'prop',
          externalId: 'extId',
          category: PROPERTY_CATEGORY.PRO,
        },
      },
    });
  });

  it('inserts a property', () => {
    const property = { externalId: '1234', value: 300000 };
    return insertProperty({
      userId: 'pro',
      body: property,
    }).then(({ message }) => {
      const propertyId = message.split('"')[1];
      const insertedProperty = PropertyService.get(propertyId, {
        value: 1,
        externalId: 1,
      });
      expect(insertedProperty.value).to.equal(property.value);
      expect(insertedProperty.externalId).to.equal(property.externalId);
    });
  });

  it('inserts a property when impersonating users', () => {
    generator({
      users: {
        _id: 'pro2',
        _factory: 'pro',
        organisations: { _id: 'org1' },
      },
    });

    const property = { externalId: '1234', value: 300000 };
    return insertProperty({
      userId: 'pro2',
      body: property,
      impersonateUser: 'pro@org.com',
    }).then(({ message }) => {
      const propertyId = message.split('"')[1];
      const insertedProperty = PropertyService.get(propertyId, {
        value: 1,
        externalId: 1,
      });
      expect(insertedProperty.value).to.equal(property.value);
      expect(insertedProperty.externalId).to.equal(property.externalId);
    });
  });

  it('throws if a property with same externalId already exists', () => {
    generator({
      properties: { externalId: '1234', userLinks: [{ _id: 'pro' }] },
    });
    const property = { externalId: '1234', value: 300000 };
    return insertProperty({
      userId: 'pro',
      body: property,
    }).then(response => {
      const { status, message, property: returnedProperty } = response;
      expect(status).to.equal(409);
      expect(message).to.equal(
        'A property with externalId "1234" already exists !',
      );
      expect(returnedProperty).to.not.equal(undefined);
    });
  });

  it('throws if a property with same externalId already exists without returning the existing property', () => {
    generator({
      properties: { externalId: '1234' },
    });
    const property = { externalId: '1234', value: 300000 };
    return insertProperty({
      userId: 'pro',
      body: property,
      expectedResponse: {
        status: 409,
        message: 'A property with externalId "1234" already exists !',
      },
    }).then(response => {
      const { status, message, property: returnedProperty } = response;
      expect(status).to.equal(409);
      expect(message).to.equal(
        'A property with externalId "1234" already exists !',
      );
      expect(returnedProperty).to.equal(undefined);
    });
  });
});
