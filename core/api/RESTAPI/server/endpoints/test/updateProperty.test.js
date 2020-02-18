/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import PropertyService from '../../../../properties/server/PropertyService';
import generator from '../../../../factories/server';
import {
  PROPERTY_CATEGORY,
  PROPERTY_STATUS,
} from '../../../../properties/propertyConstants';
import {
  getTimestampAndNonce,
  fetchAndCheckResponse,
  makeHeaders,
} from '../../test/apiTestHelpers.test';
import RESTAPI from '../../RESTAPI';
import updatePropertyAPI from '../updateProperty';

const api = new RESTAPI();
api.addEndpoint('/properties/:propertyId', 'POST', updatePropertyAPI, {
  rsaAuth: true,
  endpointName: 'Update property',
});

const updateProperty = ({
  propertyId,
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
    url: `/properties/${propertyId}`,
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

describe('REST: updateProperty', function() {
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
          status: PROPERTY_STATUS.FOR_SALE,
          $metadata: {
            permissions: { canModifyProperty: true },
          },
        },
      },
    });
  });

  it('updates a property', () => {
    const update = { value: 300000, status: PROPERTY_STATUS.SOLD };
    return updateProperty({
      userId: 'pro',
      propertyId: 'prop',
      body: update,
    }).then(response => {
      const property = PropertyService.get('prop', { value: 1 });
      expect(property.value).to.equal(update.value);
      const { status, message, property: returnedProperty } = response;
      expect(status).to.equal(200);
      expect(message).to.equal('Property with id "prop" updated !');
      expect(returnedProperty).to.not.equal(undefined);
      expect(returnedProperty.status).to.equal(PROPERTY_STATUS.SOLD);
    });
  });

  it('updates a property by externalId', () => {
    const update = { value: 300000 };
    return updateProperty({
      userId: 'pro',
      propertyId: 'extId',
      body: update,
    }).then(response => {
      const property = PropertyService.get('prop', { value: 1 });
      expect(property.value).to.equal(update.value);
      const { status, message, property: returnedProperty } = response;
      expect(status).to.equal(200);
      expect(message).to.equal('Property with id "extId" updated !');
      expect(returnedProperty).to.not.equal(undefined);
    });
  });

  it('updates a property when impersonating users', () => {
    generator({
      users: {
        _id: 'pro2',
        _factory: 'pro',
        organisations: { _id: 'org1' },
      },
    });

    const update = { value: 300000 };
    return updateProperty({
      userId: 'pro2',
      propertyId: 'prop',
      body: update,
      impersonateUser: 'pro@org.com',
    }).then(response => {
      const property = PropertyService.get('prop', { value: 1 });
      expect(property.value).to.equal(update.value);
      const { status, message, property: returnedProperty } = response;
      expect(status).to.equal(200);
      expect(message).to.equal('Property with id "prop" updated !');
      expect(returnedProperty).to.not.equal(undefined);
    });
  });

  it('throws if no property was found', () => {
    const update = { value: 300000 };
    return updateProperty({
      userId: 'pro',
      propertyId: 'some-id',
      body: update,
      expectedResponse: {
        status: 400,
        message: '[No property found for id "some-id"]',
      },
    });
  });
});
