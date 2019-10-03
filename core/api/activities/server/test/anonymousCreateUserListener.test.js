/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { EMAIL_IDS } from 'core/api/email/emailConstants';
import { anonymousCreateUser } from '../../../methods';
import { checkEmails } from '../../../../utils/testHelpers';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from '../../activityConstants';

describe.only('anonymousCreateUserListener', function () {
  this.timeout(10000);
  beforeEach(() => {
    resetDatabase();
    generator({
      organisations: [
        {
          _id: 'org1',
          name: 'Organisation 1',
          users: [
            { _id: 'pro1', _factory: 'pro', $metadata: { isMain: true } },
          ],
        },
        { _id: 'org2', name: 'Organisation 2' },
      ],
      users: [
        {
          _id: 'pro2',
          _factory: 'pro',
        },
      ],
    });
  });

  it('adds activities on the user', async () => {
    const userId = await anonymousCreateUser.run({
      user: { email: 'john.doe@test.com' },
      trackingId: '123',
    });

    await checkEmails();

    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: userId },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0].type).to.equal(ACTIVITY_TYPES.EMAIL);
    expect(activities[0].description).to.contain('Bienvenue');
    expect(activities[0].metadata).to.deep.equal({
      emailId: EMAIL_IDS.ENROLL_ACCOUNT,
      to: 'john.doe@test.com',
      from: 'e-Potek <info@e-potek.ch>',
    });
    expect(activities[1].type).to.equal(ACTIVITY_TYPES.EVENT);
    expect(activities[1].title).to.equal('Compte créé');
    expect(activities[1].metadata).to.deep.equal({
      event: ACTIVITY_EVENT_METADATA.CREATED,
      details: { referredBy: {}, referredByOrg: {} },
    });
  });

  it('adds activities on the user when user is referred by organisation', async () => {
    const userId = await anonymousCreateUser.run({
      user: { email: 'john.doe@test.com' },
      referralId: 'org2',
      trackingId: '123',
    });
    await checkEmails();

    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: userId },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0].type).to.equal(ACTIVITY_TYPES.EMAIL);
    expect(activities[0].description).to.contain('Bienvenue');
    expect(activities[0].metadata).to.deep.equal({
      emailId: EMAIL_IDS.ENROLL_ACCOUNT,
      to: 'john.doe@test.com',
      from: 'e-Potek <info@e-potek.ch>',
    });
    expect(activities[1].type).to.equal(ACTIVITY_TYPES.EVENT);
    expect(activities[1].title).to.equal('Compte créé');
    expect(activities[1].description).to.equal('Référé par Organisation 2');
    expect(activities[1].metadata).to.deep.equal({
      event: ACTIVITY_EVENT_METADATA.CREATED,
      details: {
        referredBy: {},
        referredByOrg: { _id: 'org2', name: 'Organisation 2' },
      },
    });
  });

  it('adds activities on the user when user is referred by pro user', async () => {
    const userId = await anonymousCreateUser.run({
      user: { email: 'john.doe@test.com' },
      referralId: 'pro1',
      trackingId: '123',
    });
    await checkEmails();

    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: userId },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0].type).to.equal(ACTIVITY_TYPES.EMAIL);
    expect(activities[0].description).to.contain('Bienvenue');
    expect(activities[0].metadata).to.deep.equal({
      emailId: EMAIL_IDS.ENROLL_ACCOUNT,
      to: 'john.doe@test.com',
      from: 'e-Potek <info@e-potek.ch>',
    });
    expect(activities[1].type).to.equal(ACTIVITY_TYPES.EVENT);
    expect(activities[1].title).to.equal('Compte créé');
    expect(activities[1].description).to.equal('Référé par TestFirstName TestLastName (Organisation 1)');
    expect(activities[1].metadata).to.deep.equal({
      event: ACTIVITY_EVENT_METADATA.CREATED,
      details: {
        referredBy: {
          _id: 'pro1',
          name: 'TestFirstName TestLastName',
        },
        referredByOrg: { _id: 'org1', name: 'Organisation 1' },
      },
    });
  });

  it('adds activities on the user when user is referred by pro user without any org', async () => {
    const userId = await anonymousCreateUser.run({
      user: { email: 'john.doe@test.com' },
      referralId: 'pro2',
      trackingId: '123',
    });
    await checkEmails();

    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: userId },
      activities: { type: 1, description: 1, title: 1, metadata: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0].type).to.equal(ACTIVITY_TYPES.EMAIL);
    expect(activities[0].description).to.contain('Bienvenue');
    expect(activities[0].metadata).to.deep.equal({
      emailId: EMAIL_IDS.ENROLL_ACCOUNT,
      to: 'john.doe@test.com',
      from: 'e-Potek <info@e-potek.ch>',
    });
    expect(activities[1].type).to.equal(ACTIVITY_TYPES.EVENT);
    expect(activities[1].title).to.equal('Compte créé');
    expect(activities[1].description).to.equal('Référé par TestFirstName TestLastName');
    expect(activities[1].metadata).to.deep.equal({
      event: ACTIVITY_EVENT_METADATA.CREATED,
      details: {
        referredBy: {
          _id: 'pro2',
          name: 'TestFirstName TestLastName',
        },
        referredByOrg: {},
      },
    });
  });
});
