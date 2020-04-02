import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import { setAPIUser } from 'core/api/RESTAPI/server/helpers';

import { checkEmails } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import { PROPERTY_CATEGORY } from '../../../properties/propertyConstants';
import { proInviteUser } from '../../../users/methodDefinitions';
import UserService from '../../../users/server/UserService';
import {
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from '../../activityConstants';
import ActivityService from '../ActivityService';

describe('proInviteUserListener', function() {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
    generator({
      users: { _id: 'adminId', _factory: 'admin' },
      organisations: [
        {
          _id: 'org',
          _factory: 'organisation',
          name: 'Organisation',
          users: [
            {
              _id: 'pro',
              _factory: 'pro',
              firstName: 'Pro',
              lastName: 'Account',
              $metadata: { isMain: true },
            },
            {
              _id: 'pro3',
              _factory: 'pro',
              $metadata: { isMain: false },
            },
          ],
        },
        {
          _id: 'api',
          _factory: 'organisation',
          name: 'OrganisationAPI',
          users: [{ _id: 'pro3', $metadata: { isMain: true } }],
        },
      ],
    });
  });

  it('adds activity on user', async () => {
    await ddpWithUserId('pro', () =>
      proInviteUser.run({
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
          phoneNumber: '12345',
        },
      }),
    );

    await checkEmails(2);

    const { activities = [] } = UserService.getByEmail('john.doe@test.com', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Compte créé',
      description: 'Référé par Pro Account (Organisation)',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.CREATED,
        details: {
          referredBy: { _id: 'pro', name: 'Pro Account' },
          referredByOrg: { _id: 'org', name: 'Organisation' },
          referredByAPIOrg: {},
        },
      },
    });
  });

  it('adds activity on user when user is referred by a pro via API', async () => {
    const apiUser = UserService.get('pro3', {
      name: 1,
      organisations: { name: 1 },
    });

    await ddpWithUserId('pro', () => {
      setAPIUser(apiUser);
      return proInviteUser.run({
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
          phoneNumber: '12345',
        },
      });
    });

    await checkEmails(2);

    const { activities = [] } = UserService.getByEmail('john.doe@test.com', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(2);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Compte créé',
      description: 'Référé par Pro Account (Organisation, API OrganisationAPI)',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.CREATED,
        details: {
          referredBy: { _id: 'pro', name: 'Pro Account' },
          referredByOrg: { _id: 'org', name: 'Organisation' },
          referredByAPIOrg: { _id: 'api', name: 'OrganisationAPI' },
        },
      },
    });
  });

  it('does not add the activity if user already exists', async () => {
    await generator({
      users: {
        _id: 'user',
        _factory: 'user',
        firstName: 'John',
        lastName: 'Doe',
        emails: [{ address: 'john.doe@test.com', verified: true }],
        assignedEmployee: { _id: 'adminId' },
      },
      properties: {
        _id: 'property',
        _factory: 'property',
        category: PROPERTY_CATEGORY.PRO,
        users: [
          {
            _id: 'pro',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
        ],
      },
    });

    ActivityService.addCreatedAtActivity({
      createdAt: new Date(),
      title: 'Compte créé',
      description: 'Generated',
      userLink: { _id: 'user' },
    });

    await ddpWithUserId('pro', () =>
      proInviteUser.run({
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
          phoneNumber: '12345',
        },
        propertyIds: ['property'],
      }),
    );

    await checkEmails(2);

    const { activities = [] } = UserService.getByEmail('john.doe@test.com', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(2);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Compte créé',
      description: 'Generated',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.CREATED,
      },
    });
  });
});
