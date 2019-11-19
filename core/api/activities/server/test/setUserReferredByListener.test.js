/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { setUserReferredBy } from '../../../methods';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import { ddpWithUserId } from '../../../methods/server/methodHelpers';

import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from '../../activityConstants';

describe('setUserReferredByListener', () => {
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
          _id: 'pro2',
          _factory: 'pro',
          firstName: 'Pro',
          lastName: '2',
        },
      ],
      organisations: {
        _id: 'org1',
        _factory: 'organisation',
        name: 'Organisation 1',
        users: [{ _id: 'pro1', _factory: 'pro', $metadata: { isMain: true } }],
      },
    });
  });

  it('adds activity on the user', async () => {
    await ddpWithUserId('admin', () =>
      setUserReferredBy.run({ userId: 'user', proId: 'pro1' }),
    );
    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(1);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Changement de referral',
      description: 'TestFirstName TestLastName (Organisation 1)',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: {},
          newReferral: { _id: 'pro1', name: 'TestFirstName TestLastName' },
          referralType: 'user',
        },
      },
    });
  });

  it('adds activity on the user when he was referred by someone else before', async () => {
    UserService.update({
      userId: 'user',
      object: { referredByUserLink: 'pro2' },
    });
    await ddpWithUserId('admin', () =>
      setUserReferredBy.run({ userId: 'user', proId: 'pro1' }),
    );
    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(1);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Changement de referral',
      description: 'TestFirstName TestLastName (Organisation 1)',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: { _id: 'pro2', name: 'Pro 2' },
          newReferral: { _id: 'pro1', name: 'TestFirstName TestLastName' },
          referralType: 'user',
        },
      },
    });
  });

  it('does not add activity on the user when the referral does not change', async () => {
    UserService.update({
      userId: 'user',
      object: { referredByUserLink: 'pro2' },
    });
    await ddpWithUserId('admin', () =>
      setUserReferredBy.run({ userId: 'user', proId: 'pro2' }),
    );
    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(0);
  });
});
