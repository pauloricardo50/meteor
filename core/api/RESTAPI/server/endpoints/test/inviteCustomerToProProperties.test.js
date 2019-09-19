/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import sinon from 'sinon';

import UserService from '../../../../users/server/UserService';
import PropertyService from '../../../../properties/server/PropertyService';
import {
  PROPERTY_CATEGORY,
  PROPERTY_STATUS,
} from '../../../../properties/propertyConstants';
import SlackService from '../../../../slack/server/SlackService';
import generator from '../../../../factories';
import RESTAPI from '../../RESTAPI';
import inviteCustomerToProPropertiesAPI from '../inviteCustomerToProProperties';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';
import { HTTP_STATUS_CODES } from '../../restApiConstants';

const customerToInvite = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '+41 22 566 01 10',
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
  shareSolvency,
  invitationNote,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const body = {
    user: userData || customerToInvite,
    properties,
    shareSolvency,
    invitationNote,
  };
  const query = impersonateUser
    ? { 'impersonate-user': impersonateUser }
    : undefined;
  return fetchAndCheckResponse({
    url: '/properties/invite-customer',
    query,
    data: {
      method: 'POST',
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
          organisations: [{ _id: 'org', name: 'Main Org' }],
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
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"ext1\", \"ext3\", \"property1\", \"property2\" and \"property3\"`,
      },
    }).then(() => {
      const customer = UserService.fetchOne({
        $filters: { 'emails.address': { $in: [customerToInvite.email] } },
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
        loans: { shareSolvency: 1 },
      });

      expect(customer.loans[0].shareSolvency).to.equal(undefined);
    });
  });

  it('invites a customer to multiple properties with solvency sharing', () => {
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
      shareSolvency: true,
      expectedResponse: {
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"ext1\", \"ext3\", \"property1\", \"property2\" and \"property3\"`,
      },
    }).then(() => {
      const customer = UserService.fetchOne({
        $filters: { 'emails.address': { $in: [customerToInvite.email] } },
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
        loans: { shareSolvency: 1 },
      });

      expect(customer.loans[0].shareSolvency).to.equal(true);
    });
  });

  it('invites a customer to multiple properties with invitation note', () => {
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
      shareSolvency: true,
      invitationNote: 'testNote',
      expectedResponse: {
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"ext1\", \"ext3\", \"property1\", \"property2\" and \"property3\"`,
      },
    })
      .then(() => {
        const customer = UserService.fetchOne({
          $filters: { 'emails.address': { $in: [customerToInvite.email] } },
          referredByUserLink: 1,
          referredByOrganisationLink: 1,
          loans: { shareSolvency: 1 },
          tasks: { description: 1 },
        });

        expect(customer.loans[0].shareSolvency).to.equal(true);

        let { tasks = [] } = customer;
        let intervalCount = 0;

        return new Promise((resolve, reject) => {
          const interval = Meteor.setInterval(() => {
            if (tasks.length === 0 && intervalCount < 10) {
              tasks = UserService.fetchOne({
                $filters: {
                  'emails.address': { $in: [customerToInvite.email] },
                },
                tasks: { description: 1 },
              }).tasks || [];
              intervalCount++;
            } else {
              Meteor.clearInterval(interval);
              if (intervalCount >= 10) {
                reject('Fetch tasks timeout');
              }
              resolve(tasks);
            }
          }, 100);
        });
      })
      .then((tasks) => {
        expect(tasks.length).to.equal(1);
        expect(tasks[0].description).to.contain('TestFirstName TestLastName');
        expect(tasks[0].description).to.contain('testNote');
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
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"ext2\", \"ext3\", \"property4\", \"property5\" and \"property6\"`,
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

  it('returns an error when the user does not have the right permissions with impersonateUser', () => {
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
        message: '[Each property must have either a "_id" or "externalId" key]',
      },
    }));

  it('returns an error when properties is empty', () =>
    inviteCustomerToProProperties({
      properties: [],
      expectedResponse: {
        status: 400,
        message: '[You must provide at least one valid property]',
      },
    }));

  it('returns an error when no property is given', () =>
    inviteCustomerToProProperties({
      expectedResponse: {
        status: 400,
        message: '[You must provide at least one valid property]',
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
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"property2\"`,
      },
    }).then(() =>
      inviteCustomerToProProperties({
        properties: [
          { _id: 'property1' },
          { _id: 'property2' },
          { _id: 'property3' },
        ],
        expectedResponse: {
          status: HTTP_STATUS_CODES.CONFLICT,
          message: 'Ce client est déjà invité à ce bien immobilier [409]',
        },
      }));
  });

  it('cleans invalid fields in insert', () => {
    const newProperty = {
      externalId: 'myId',
      status: PROPERTY_STATUS.SOLD,
    };

    return inviteCustomerToProProperties({
      properties: [newProperty],
      expectedResponse: {
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"myId\"`,
      },
    }).then(() => {
      const property = PropertyService.findOne({ externalId: 'myId' });
      expect(property.status).to.equal(PROPERTY_STATUS.FOR_SALE);
    });
  });

  it('does not allow invalid fields in insert', () => {
    const newProperty = {
      externalId: 'myId',
      propertyType: 'FALSE_TYPE',
    };

    return inviteCustomerToProProperties({
      properties: [newProperty],
      expectedResponse: {
        status: 400,
        message: '[ClientError: FALSE_TYPE is not an allowed value]',
      },
    });
  });

  it('sends a properly formatted slack notification', async () => {
    const spy = sinon.spy();
    sinon.stub(SlackService, 'send').callsFake(spy);

    const newProperty = { externalId: 'myId', address1: 'Rue du parc 3' };

    await inviteCustomerToProProperties({
      properties: [newProperty],
      expectedResponse: {
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"myId\"`,
      },
    });

    expect(spy.calledOnce).to.equal(true);
    expect(spy.args[0][0].username).to.equal('TestFirstName TestLastName (Main Org, API Main Org)');
    expect(spy.args[0][0].attachments[0].title).to.equal('Test User a été invité au bien immo "Rue du parc 3"');

    SlackService.send.restore();
  });
});
