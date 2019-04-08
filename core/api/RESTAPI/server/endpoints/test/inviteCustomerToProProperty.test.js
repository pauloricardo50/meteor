/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import UserService from '../../../../users/server/UserService';
import PropertyService from '../../../../properties/server/PropertyService';
import { PROPERTY_CATEGORY } from '../../../../properties/propertyConstants';
import generator from '../../../../factories/index';
import RESTAPI from '../../RESTAPI';
import inviteCustomerToProPropertyAPI from '../inviteCustomerToProProperty';
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
  '/properties/:propertyId/invite-customer',
  'POST',
  inviteCustomerToProPropertyAPI,
);

const inviteCustomerToProProperty = ({
  userData,
  expectedResponse,
  propertyId,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const body = { user: userData || customerToInvite };
  return fetchAndCheckResponse({
    url: `/properties/${propertyId}/invite-customer`,
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

describe.only('REST: inviteCustomerToProProperty', function () {
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
        proProperties: [{ _id: 'property', category: PROPERTY_CATEGORY.PRO }],
      },
    });
    keyPair = UserService.generateKeyPair({ userId: 'pro' });
  });

  it('invites a customer to property', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    return inviteCustomerToProProperty({
      propertyId: 'property',
      expectedResponse: {
        message: `Successfully invited user \"${
          customerToInvite.email
        }\" to property id \"property\"`,
      },
    });
  });

  it('returns an error when the user has not the right permissions', () =>
    inviteCustomerToProProperty({
      propertyId: 'property',
      expectedResponse: {
        status: 400,
        message:
          'Vous ne pouvez pas inviter de clients sur ce bien immobilier [NOT_AUTHORIZED]',
      },
    }));

  it('returns an error if the customer is already invited to property', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property',
      userId: 'pro',
      permissions: { canInviteCustomers: true },
    });
    return inviteCustomerToProProperty({
      propertyId: 'property',
      expectedResponse: {
        message: `Successfully invited user \"${
          customerToInvite.email
        }\" to property id \"property\"`,
      },
    }).then(() =>
      inviteCustomerToProProperty({
        propertyId: 'property',
        expectedResponse: {
          status: 400,
          message: '[Cet utilisateur est déjà invité à ce bien immobilier]',
        },
      }));
  });

  //   it('returns an error if the user already exists', () => {
  //     generator({
  //       users: { emails: [{ address: customerToRefer.email, verified: false }] },
  //     });
  //     return referCustomer({
  //       expectedResponse: {
  //         status: 400,
  //         message:
  //           "[Ce client existe déjà. Vous ne pouvez pas le référer, mais vous pouvez l'inviter sur un de vos biens immobiliers.]",
  //       },
  //     });
  //   });
});
