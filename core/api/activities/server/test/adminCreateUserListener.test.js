/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ROLES } from 'core/api/users/userConstants';
import { ddpWithUserId } from '../../../methods/server/methodHelpers';
import { adminCreateUser } from '../../../methods';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from '../../activityConstants';

describe('adminCreateUserListener', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      users: {
        _id: 'admin',
        _factory: 'admin',
        firstName: 'Admin',
        lastName: 'E-Potek',
      },
    });
  });

  it('adds activity on the user', async () => {
    await ddpWithUserId('admin', () =>
      adminCreateUser.run({
        options: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.com',
        },
        role: ROLES.USER,
      }));

    const { activities = [] } = UserService.fetchOne({
      $filters: { 'emails.address': 'john.doe@test.com' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(1);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Compte créé',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.CREATED,
        details: { admin: { _id: 'admin', name: 'Admin E-Potek' } },
      },
    });
  });
});
