/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { assignAdminToUser } from '../../../methods';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import { ddpWithUserId } from '../../../methods/methodHelpers';

import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from '../../activityConstants';

describe('assignAdminToUserListener', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        {
          _id: 'admin',
          _factory: 'admin',
          firstName: 'Admin',
          lastName: 'E-Potek',
        },
        {
          _id: 'user',
          emails: [{ address: 'john.doe@test.com', verified: true }],
        },
        {
          _id: 'admin2',
          _factory: 'admin',
          firstName: 'Admin2',
          lastName: 'E-Potek',
        },
      ],
    });
  });

  it('adds activity on the user', async () => {
    await ddpWithUserId('admin', () =>
      assignAdminToUser.run({ userId: 'user', adminId: 'admin' }),
    );
    const { activities = [] } = UserService.get('user', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(1);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Changement de conseiller',
      description: 'Admin E-Potek',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_ASSIGNEE,
        details: {
          oldAssignee: {},
          newAssignee: { _id: 'admin', name: 'Admin E-Potek' },
        },
      },
    });
  });

  it('adds activity on the user when the assignee changes', async () => {
    UserService.update({
      userId: 'user',
      object: { assignedEmployeeId: 'admin2' },
    });
    await ddpWithUserId('admin', () =>
      assignAdminToUser.run({ userId: 'user', adminId: 'admin' }),
    );
    const { activities = [] } = UserService.get('user', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(1);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Changement de conseiller',
      description: 'Admin E-Potek',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_ASSIGNEE,
        details: {
          oldAssignee: { _id: 'admin2', name: 'Admin2 E-Potek' },
          newAssignee: { _id: 'admin', name: 'Admin E-Potek' },
        },
      },
    });
  });

  it('does not add activity on the user when the assignee does not change', async () => {
    UserService.update({
      userId: 'user',
      object: { assignedEmployeeId: 'admin2' },
    });
    await ddpWithUserId('admin', () =>
      assignAdminToUser.run({ userId: 'user', adminId: 'admin2' }),
    );
    const { activities = [] } = UserService.get('user', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(0);
  });
});
