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
  properties,
  impersonateUser,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const body = {
    user: userData || customerToInvite,
    properties,
  };
  const query = impersonateUser ? { impersonateUser } : undefined;
  return fetchAndCheckResponse({
    url: '/properties/invite-customer',
    query,
    data: {
      method: 'POST',
      headers: makeHeaders({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        timestamp,
        nonce,
        body,
        query,
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
      users: [
        {
          _factory: 'pro',
          _id: 'pro',
          emails: [{ address: 'pro@org.com', verified: true }],
          organisations: [{ _id: 'org' }],
          proProperties: [
            { _id: 'property1', category: PROPERTY_CATEGORY.PRO },
            { _id: 'property2', category: PROPERTY_CATEGORY.PRO },
            { _id: 'property3', category: PROPERTY_CATEGORY.PRO },
            {
              _id: 'externalProperty1',
              externalId: 'ext1',
              category: PROPERTY_CATEGORY.PRO,
            },
          ],
        },
        {
          _factory: 'pro',
          _id: 'pro2',
          emails: [{ address: 'pro2@org.com', verified: true }],
          organisations: [{ _id: 'org' }],
          proProperties: [
            { _id: 'property4', category: PROPERTY_CATEGORY.PRO },
            { _id: 'property5', category: PROPERTY_CATEGORY.PRO },
            { _id: 'property6', category: PROPERTY_CATEGORY.PRO },
            {
              _id: 'externalProperty2',
              externalId: 'ext2',
              category: PROPERTY_CATEGORY.PRO,
            },
          ],
        },
        {
          _factory: 'pro',
          _id: 'pro3',
          emails: [{ address: 'pro3@org2.com', verified: true }],
          organisation: [{ _id: 'org2' }],
        },
      ],
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
    PropertyService.setProUserPermissions({
      propertyId: 'externalProperty1',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    return inviteCustomerToProProperties({
      properties: [
        { _id: 'property1' },
        { _id: 'property2' },
        { _id: 'property3' },
        { externalId: 'ext1' },
        { externalId: 'ext3', category: PROPERTY_CATEGORY.PRO },
      ],
      expectedResponse: {
        message: `Successfully invited user \"${
          customerToInvite.email
        }\" to property ids \"ext1\", \"ext3\", \"property1\", \"property2\" and \"property3\"`,
      },
    });
  });

  it('invites a customer to multiple properties with impersonateUser', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property4',
      userId: 'pro2',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'property5',
      userId: 'pro2',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'property6',
      userId: 'pro2',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'externalProperty2',
      userId: 'pro2',
      permissions: { canInviteCustomers: true },
    });
    return inviteCustomerToProProperties({
      properties: [
        { _id: 'property4' },
        { _id: 'property5' },
        { _id: 'property6' },
        { externalId: 'ext2' },
        { externalId: 'ext3', category: PROPERTY_CATEGORY.PRO },
      ],
      impersonateUser: 'pro2@org.com',
      expectedResponse: {
        message: `Successfully invited user \"${
          customerToInvite.email
        }\" to property ids \"ext2\", \"ext3\", \"property4\", \"property5\" and \"property6\"`,
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
      properties: [
        { _id: 'property1' },
        { _id: 'property2' },
        { _id: 'property3' },
      ],
      expectedResponse: {
        status: 400,
        message:
          'Vous ne pouvez pas inviter de clients sur ce bien immobilier [NOT_AUTHORIZED]',
      },
    });
  });

  it('returns an error when the user has not the right permissions with impersonateUser', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property4',
      userId: 'pro2',
      permissions: { canInviteCustomers: true },
    });
    PropertyService.setProUserPermissions({
      propertyId: 'property5',
      userId: 'pro2',
      permissions: { canInviteCustomers: true },
    });

    return inviteCustomerToProProperties({
      properties: [
        { _id: 'property4' },
        { _id: 'property5' },
        { _id: 'property6' },
      ],
      impersonateUser: 'pro2@org.com',
      expectedResponse: {
        status: 400,
        message:
          'Vous ne pouvez pas inviter de clients sur ce bien immobilier [NOT_AUTHORIZED]',
      },
    });
  });

  it('returns an error when the user is not in the same organisation as impersonateUser', () =>
    inviteCustomerToProProperties({
      properties: [
        { _id: 'property4' },
        { _id: 'property5' },
        { _id: 'property6' },
      ],
      impersonateUser: 'pro3@org2.com',
      expectedResponse: {
        status: 400,
        message:
          '[User with email address "pro3@org2.com" is not part of your organisation]',
      },
    }));

  it('returns an error when impersonateUser does not exist', () =>
    inviteCustomerToProProperties({
      properties: [
        { _id: 'property4' },
        { _id: 'property5' },
        { _id: 'property6' },
      ],
      impersonateUser: 'pro4@org.com',
      expectedResponse: {
        status: 400,
        message: '[No user found for email address "pro4@org.com"]',
      },
    }));

  it('returns an error when property is invalid', () =>
    inviteCustomerToProProperties({
      properties: [{ _id: 'property4', externalId: 'test' }],
      expectedResponse: {
        status: 400,
        message:
          '[Every property must have either a "_id" or "externalId" key]',
      },
    }));

  it('returns an error when properties is empty', () =>
    inviteCustomerToProProperties({
      properties: [],
      expectedResponse: {
        status: 400,
        message: '[properties cannot be empty]',
      },
    }));

  it('returns an error when no property is given', () =>
    inviteCustomerToProProperties({
      expectedResponse: {
        status: 400,
        message: '[properties cannot be empty]',
      },
    }));

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
      properties: [{ _id: 'property2' }],
      expectedResponse: {
        message: `Successfully invited user \"${
          customerToInvite.email
        }\" to property ids \"property2\"`,
      },
    }).then(() =>
      inviteCustomerToProProperties({
        properties: [
          { _id: 'property1' },
          { _id: 'property2' },
          { _id: 'property3' },
        ],
        expectedResponse: {
          status: 400,
          message: '[Cet utilisateur est déjà invité à ce bien immobilier]',
        },
      }));
  });
});
