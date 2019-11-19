/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { setUserReferredByOrganisation } from '../../../methods';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import { ddpWithUserId } from '../../../methods/server/methodHelpers';

import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from '../../activityConstants';

describe('setUserReferredByOrganisationListener', () => {
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
      ],
      organisations: [
        {
          _id: 'org1',
          _factory: 'organisation',
          name: 'Organisation1',
        },
        {
          _id: 'org2',
          _factory: 'organisation',
          name: 'Organisation2',
        },
      ],
    });
  });

  it('adds activity on the user', async () => {
    await ddpWithUserId('admin', () =>
      setUserReferredByOrganisation.run({
        userId: 'user',
        organisationId: 'org1',
      }),
    );
    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(1);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Changement de referral',
      description: 'Organisation1',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: {},
          newReferral: { _id: 'org1', name: 'Organisation1' },
          referralType: 'org',
        },
      },
    });
  });

  it('adds activity on the user when he was referred by another organisation before', async () => {
    UserService.update({
      userId: 'user',
      object: { referredByOrganisationLink: 'org2' },
    });
    await ddpWithUserId('admin', () =>
      setUserReferredByOrganisation.run({
        userId: 'user',
        organisationId: 'org1',
      }),
    );
    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(1);
    expect(activities[0]).to.deep.include({
      type: ACTIVITY_TYPES.EVENT,
      title: 'Changement de referral',
      description: 'Organisation1',
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: { _id: 'org2', name: 'Organisation2' },
          newReferral: { _id: 'org1', name: 'Organisation1' },
          referralType: 'org',
        },
      },
    });
  });

  it('does not add activity on the user when the referral does not change', async () => {
    UserService.update({
      userId: 'user',
      object: { referredByOrganisationLink: 'org2' },
    });
    await ddpWithUserId('admin', () =>
      setUserReferredByOrganisation.run({
        userId: 'user',
        organisationId: 'org2',
      }),
    );
    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });

    expect(activities.length).to.equal(0);
  });
});
