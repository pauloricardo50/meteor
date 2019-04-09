/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import UserService from '../../../../users/server/UserService';
import PropertyService from '../../../../properties/server/PropertyService';
import { PROPERTY_CATEGORY } from '../../../../properties/propertyConstants';
import generator from '../../../../factories';
import RESTAPI from '../../RESTAPI';
import inviteCustomerToProPropertiesAPI from '../inviteCustomerToProProperties';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';

let keyPair;
const customerToInvite = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '1234',
};

const api = new RESTAPI();
api.addEndpoint(
  '/properties/invite-customer',
  'POST',
  inviteCustomerToProPropertiesAPI,
);

const inviteCustomerToProProperties = ({
  userData,
  expectedResponse,
  propertyIds,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const body = { user: userData || customerToInvite, propertyIds };
  return fetchAndCheckResponse({
    url: '/properties/invite-customer',
    data: {
      method: 'POST',
      headers: makeHeaders({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        timestamp,
        nonce,
        body,
      }),
      body: JSON.stringify(body),
    },
    expectedResponse,
  });
};

describe('REST: inviteCustomerToProProperties', function () {
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
    generator({
      users: {
        _factory: 'pro',
        _id: 'pro',
        organisations: [{ _id: 'org' }],
        proProperties: [
          { _id: 'property1', category: PROPERTY_CATEGORY.PRO },
          { _id: 'property2', category: PROPERTY_CATEGORY.PRO },
          { _id: 'property3', category: PROPERTY_CATEGORY.PRO },
        ],
      },
    });
    keyPair = UserService.generateKeyPair({ userId: 'pro' });
  });

  it('invites a customer to multiple properties', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property1',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'property2',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'property3',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    return inviteCustomerToProProperties({
      propertyIds: ['property1', 'property2', 'property3'],
      expectedResponse: {
        message: `Successfully invited user \"${
          customerToInvite.email
        }\" to property ids \"property1\", \"property2\" and \"property3\"`,
      },
    });
  });

  it('returns an error when the user has not the right permissions', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property1',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'property2',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });

    return inviteCustomerToProProperties({
      propertyIds: ['property1', 'property2', 'property3'],
      expectedResponse: {
        status: 400,
        message:
          'Vous ne pouvez pas inviter de clients sur ce bien immobilier [NOT_AUTHORIZED]',
      },
    });
  });

  it('returns an error if the customer is already invited to one property', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property1',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'property2',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'property3',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    return inviteCustomerToProProperties({
      propertyIds: ['property2'],
      expectedResponse: {
        message: `Successfully invited user \"${
          customerToInvite.email
        }\" to property ids \"property2\"`,
      },
    }).then(() =>
      inviteCustomerToProProperties({
        propertyIds: ['property1', 'property2', 'property3'],
        expectedResponse: {
          status: 400,
          message: '[Cet utilisateur est déjà invité à ce bien immobilier]',
        },
      }));
  });
});
