/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import pollUntilReady from 'core/utils/pollUntilReady';

import { checkEmails, resetDatabase } from '../../../../../utils/testHelpers';
import generator from '../../../../factories/server';
import {
  PROPERTY_CATEGORY,
  PROPERTY_STATUS,
} from '../../../../properties/propertyConstants';
import PropertyService from '../../../../properties/server/PropertyService';
import SlackService from '../../../../slack/server/SlackService';
import UserService from '../../../../users/server/UserService';
import RESTAPI from '../../RESTAPI';
import { HTTP_STATUS_CODES } from '../../restApiConstants';
import {
  fetchAndCheckResponse,
  getTimestampAndNonce,
  makeHeaders,
} from '../../test/apiTestHelpers.test';
import inviteCustomerToProPropertiesAPI from '../inviteCustomerToProProperties';

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
  { rsaAuth: true, endpointName: 'Invite customer to property' },
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
    api.start();
  });

  after(() => {
    api.reset();
  });

  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        {
          _id: 'admin',
          _factory: 'admin',

          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
        {
          _factory: 'pro',
          _id: 'pro',
          emails: [{ address: 'pro@org.com', verified: true }],
          organisations: [
            { _id: 'org', name: 'Main Org', $metadata: { isMain: true } },
          ],
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
          assignedEmployee: { _id: 'admin' },
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
        {
          _factory: 'pro',
          _id: 'pro2',
          emails: [{ address: 'pro2@org.com', verified: true }],
          organisations: [{ _id: 'org', $metadata: { isMain: true } }],
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
          assignedEmployee: { _id: 'admin' },
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
        {
          _factory: 'pro',
          _id: 'pro3',
          emails: [{ address: 'pro3@org2.com', verified: true }],
          organisations: [{ _id: 'org2', $metadata: { isMain: true } }],
          assignedEmployee: { _id: 'admin' },
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
        },
      ],
    });
  });

  it('invites a customer to multiple properties', async () => {
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

    await inviteCustomerToProProperties({
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
    });
    const customer = UserService.getByEmail(customerToInvite.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1 },
    });

    expect(customer.loans[0].shareSolvency).to.equal(undefined);

    await checkEmails(2);
  });

  it('invites a customer to multiple properties with solvency sharing', async () => {
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

    await inviteCustomerToProProperties({
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
    });

    const customer = UserService.getByEmail(customerToInvite.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1 },
    });

    expect(customer.loans[0].shareSolvency).to.equal(true);

    await checkEmails(2);
  });

  it('invites a customer to multiple properties with invitation note', async () => {
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
    await inviteCustomerToProProperties({
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
    });

    const customer = UserService.getByEmail(customerToInvite.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1, activities: { description: 1, title: 1 } },
      activities: { description: 1, title: 1 },
    });

    expect(customer.loans[0].shareSolvency).to.equal(true);

    const { activities: customerActivities = [] } = customer;
    const { activities: loanActivities = [] } = customer.loans?.[0] || {};

    let activities = [...customerActivities, ...loanActivities];

    activities = await pollUntilReady(() => {
      if (activities.length > 0) {
        return activities;
      }

      const { loans, activities: userActs = [] } = UserService.getByEmail(
        customerToInvite.email,
        {
          loans: { shareSolvency: 1, activities: { description: 1 } },
          activities: { description: 1 },
        },
      );

      const { activities: loanActs = [] } = loans?.[0] || {};

      activities = [...userActs, ...loanActs];

      return !!activities.length && activities;
    });

    expect(activities.length).to.equal(3);
    expect(activities[0].description).to.contain('TestFirstName TestLastName');
    expect(activities[0].description).to.contain('testNote');
    expect(activities[1].title).to.contain('Dossier créé');
    expect(activities[2].description).to.contain('TestNote');

    await checkEmails(2);
  });

  it('invites a customer to multiple properties with impersonateUser', async () => {
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

    await inviteCustomerToProProperties({
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

    await checkEmails(2);
  });

  it('returns an error when the user has not the right permissions', async () => {
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

    await inviteCustomerToProProperties({
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

  it('returns an error when the user does not have the right permissions with impersonateUser', async () => {
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

    await inviteCustomerToProProperties({
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

  it('returns an error when the user is not in the same organisation as impersonateUser', async () => {
    await inviteCustomerToProProperties({
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
    });
  });

  it('returns an error when impersonateUser does not exist', async () => {
    await inviteCustomerToProProperties({
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
    });
  });

  it('returns an error when property is invalid', async () => {
    await inviteCustomerToProProperties({
      properties: [{ _id: 'property4', externalId: 'test' }],
      expectedResponse: {
        status: 400,
        message: '[Each property must have either a "_id" or "externalId" key]',
      },
    });
  });

  it('returns an error when properties is empty', async () => {
    await inviteCustomerToProProperties({
      properties: [],
      expectedResponse: {
        status: 400,
        message: '[You must provide at least one valid property]',
      },
    });
  });

  it('returns an error when no property is given', async () => {
    await inviteCustomerToProProperties({
      expectedResponse: {
        status: 400,
        message: '[You must provide at least one valid property]',
      },
    });
  });

  it('returns an error if the customer is already invited to one property', async () => {
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

    await inviteCustomerToProProperties({
      properties: [{ _id: 'property2' }],
      expectedResponse: {
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"property2\"`,
      },
    });

    await inviteCustomerToProProperties({
      properties: [
        { _id: 'property1' },
        { _id: 'property2' },
        { _id: 'property3' },
      ],
      expectedResponse: {
        status: HTTP_STATUS_CODES.CONFLICT,
        message: 'Ce client est déjà invité à ce bien immobilier [409]',
      },
    });

    await checkEmails(2);
  });

  it('cleans invalid fields in insert', async () => {
    const newProperty = {
      externalId: 'myId',
      status: PROPERTY_STATUS.SOLD,
    };

    await inviteCustomerToProProperties({
      properties: [newProperty],
      expectedResponse: {
        message: `Successfully invited user \"${customerToInvite.email}\" to property ids \"myId\"`,
      },
    });
    const property = PropertyService.get({ externalId: 'myId' }, { status: 1 });
    expect(property.status).to.equal(PROPERTY_STATUS.FOR_SALE);

    await checkEmails(2);
  });

  it('does not allow invalid fields in insert', async () => {
    const newProperty = {
      externalId: 'myId',
      propertyType: 'FALSE_TYPE',
    };

    await inviteCustomerToProProperties({
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

    expect(spy.called).to.equal(true);
    expect(spy.lastCall.args[0].username).to.equal(
      'TestFirstName TestLastName (Main Org, API Main Org)',
    );
    expect(spy.lastCall.args[0].attachments[0].title).to.equal(
      'Test User a été invité au bien immo "Rue du parc 3"',
    );
    SlackService.send.restore();

    await checkEmails(2);
  });
});
