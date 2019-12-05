/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import moment from 'moment';

import { userPasswordReset } from '../../../methods';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import { ddpWithUserId } from '../../../methods/server/methodHelpers';
import ActivityService from '../ActivityService';

import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from '../../activityConstants';

describe('userPasswordResetListener', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      users: {
        _id: 'user',
        emails: [{ address: 'john.doe@test.com', verified: true }],
      },
    });
  });

  it('adds activities on the user', async () => {
    await ddpWithUserId('user', () => userPasswordReset.run({}));

    const { activities = [] } = UserService.get('user', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Mot de passe choisi',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
      },
    });
    expect(activities[1]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Première connexion',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
      },
    });
  });

  it('adds activity on the user when it is not the first time he logs in', async () => {
    const yesterday = moment(new Date())
      .subtract(1, 'days')
      .toDate();

    ActivityService.addServerActivity({
      type: ACTIVITY_TYPES.EVENT,
      metadata: { event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION },
      userLink: { _id: 'user' },
      title: 'Première connexion',
      createdBy: 'user',
      date: yesterday,
    });
    await ddpWithUserId('user', () => userPasswordReset.run({}));

    const { activities = [] } = UserService.get('user', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Première connexion',
      date: yesterday,
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
      },
    });
    expect(activities[1]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Mot de passe choisi',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
      },
    });
  });
});
