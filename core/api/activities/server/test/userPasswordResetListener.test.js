/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

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

    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0].type).to.equal(ACTIVITY_TYPES.EVENT);
    expect(activities[0].title).to.equal('Mot de passe choisi');
    expect(activities[0].metadata).to.deep.equal({
      event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
    });
    expect(activities[1].type).to.equal(ACTIVITY_TYPES.EVENT);
    expect(activities[1].title).to.equal('Première connexion');
    expect(activities[1].metadata).to.deep.equal({
      event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
    });
  });

  it('adds activity on the user when it is not the first time he logs in', async () => {
    ActivityService.addServerActivity({
      type: ACTIVITY_TYPES.EVENT,
      metadata: { event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION },
      userLink: { _id: 'user' },
      title: 'Première connexion',
      createdBy: 'user',
    });
    await ddpWithUserId('user', () => userPasswordReset.run({}));

    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0].type).to.equal(ACTIVITY_TYPES.EVENT);
    expect(activities[0].title).to.equal('Première connexion');
    expect(activities[0].metadata).to.deep.equal({
      event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
    });
    expect(activities[1].type).to.equal(ACTIVITY_TYPES.EVENT);
    expect(activities[1].title).to.equal('Mot de passe choisi');
    expect(activities[1].metadata).to.deep.equal({
      event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
    });
  });
});
