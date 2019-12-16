/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { userVerifyEmail } from '../../../methods';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import { ddpWithUserId } from '../../../methods/methodHelpers';

import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from '../../activityConstants';

describe('userVerifyEmailListener', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        {
          _id: 'user',
          emails: [{ address: 'john.doe@test.com', verified: false }],
        },
      ],
    });
  });

  it('adds activity on the user', async () => {
    await ddpWithUserId('user', () => userVerifyEmail.run({}));
    const { activities = [] } = UserService.get('user', {
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(1);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Adresse email vérifiée',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_VERIFIED_EMAIL,
      },
    });
  });
});
