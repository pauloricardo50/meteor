import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import { ROLES } from 'core/api/users/userConstants';

import generator from '../../../factories/server';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import { adminCreateUser } from '../../../users/methodDefinitions';
import UserService from '../../../users/server/UserService';
import {
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
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
      }),
    );

    const { activities = [] } = UserService.getByEmail('john.doe@test.com', {
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
