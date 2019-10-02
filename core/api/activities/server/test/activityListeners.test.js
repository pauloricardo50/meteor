/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { EMAIL_IDS } from 'core/api/email/emailConstants';
import { ddpWithUserId } from '../../../methods/server/methodHelpers';
import {
  toggleAccount,
  anonymousCreateUser,
  userPasswordReset,
  setUserReferredByOrganisation,
  proInviteUser,
  adminCreateUser,
  assignAdminToUser,
  assignAdminToNewUser,
  setUserReferredBy,
  changeEmail,
  userVerifyEmail,
} from '../../../methods';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from '../../activityConstants';
import ActivityService from '../ActivityService';

describe.only('activityListeners', function () {
  this.timeout(10000);
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

  describe('toggleAccount', () => {
    beforeEach(() => {
      generator({
        users: {
          _id: 'user',
          _factory: 'user',
        },
      });
    });

    it('adds activity on the user', async () => {
      await ddpWithUserId('admin', () => toggleAccount.run({ userId: 'user' }));
      await ddpWithUserId('admin', () => toggleAccount.run({ userId: 'user' }));
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { description: 1, title: 1 },
      });
      expect(activities.length).to.equal(2);
      expect(activities[0].title).to.equal('Compte désactivé');
      expect(activities[0].description).to.equal('Par Admin E-Potek');
      expect(activities[1].title).to.equal('Compte activé');
      expect(activities[1].description).to.equal('Par Admin E-Potek');
    });
  });

  describe('anonymousCreateUser', () => {
    beforeEach(() => {
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
        users: {
          _id: 'pro2',
          _factory: 'pro',
        },
      });
    });

    it('adds activities on the user', async () => {
      const userId = await anonymousCreateUser.run({
        user: { email: 'john.doe@test.com' },
        trackingId: '123',
      });
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

  describe('userPasswordReset', () => {
    beforeEach(() => {
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
        event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTIOM,
      });
    });

    it('adds activity on the user when it is not the first time he logs in', async () => {
      ActivityService.addServerActivity({
        type: ACTIVITY_TYPES.EVENT,
        metadata: { event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTIOM },
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
        event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTIOM,
      });
      expect(activities[1].type).to.equal(ACTIVITY_TYPES.EVENT);
      expect(activities[1].title).to.equal('Mot de passe choisi');
      expect(activities[1].metadata).to.deep.equal({
        event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
      });
    });
  });

  describe('setUserReferredBy', () => {
    beforeEach(() => {
      generator({
        users: [
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
          users: [
            { _id: 'pro1', _factory: 'pro', $metadata: { isMain: true } },
          ],
        },
      });
    });

    it('adds activity on the user', async () => {
      await ddpWithUserId('admin', () =>
        setUserReferredBy.run({ userId: 'user', proId: 'pro1' }));
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { type: 1, description: 1, title: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(1);
      expect(activities[0].type).to.equal(ACTIVITY_TYPES.EVENT);
      expect(activities[0].title).to.equal('Changement de referral');
      expect(activities[0].description).to.equal('TestFirstName TestLastName (Organisation 1)');
      expect(activities[0].metadata).to.deep.equal({
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: {},
          newReferral: { _id: 'pro1', name: 'TestFirstName TestLastName' },
          referralType: 'user',
        },
      });
    });

    it('adds activity on the user when he was referred by someone else before', async () => {
      UserService.update({
        userId: 'user',
        object: { referredByUserLink: 'pro2' },
      });
      await ddpWithUserId('admin', () =>
        setUserReferredBy.run({ userId: 'user', proId: 'pro1' }));
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { type: 1, description: 1, title: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(1);
      expect(activities[0].type).to.equal(ACTIVITY_TYPES.EVENT);
      expect(activities[0].title).to.equal('Changement de referral');
      expect(activities[0].description).to.equal('TestFirstName TestLastName (Organisation 1)');
      expect(activities[0].metadata).to.deep.equal({
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: { _id: 'pro2', name: 'Pro 2' },
          newReferral: { _id: 'pro1', name: 'TestFirstName TestLastName' },
          referralType: 'user',
        },
      });
    });

    it('does not adds activity on the user when the referral does not change', async () => {
      UserService.update({
        userId: 'user',
        object: { referredByUserLink: 'pro2' },
      });
      await ddpWithUserId('admin', () =>
        setUserReferredBy.run({ userId: 'user', proId: 'pro2' }));
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { type: 1, description: 1, title: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(0);
    });
  });

  describe('setUserReferredByOrganisation', () => {
    beforeEach(() => {
      generator({
        users: [
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
        }));
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { type: 1, description: 1, title: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(1);
      expect(activities[0].type).to.equal(ACTIVITY_TYPES.EVENT);
      expect(activities[0].title).to.equal('Changement de referral');
      expect(activities[0].description).to.equal('Organisation1');
      expect(activities[0].metadata).to.deep.equal({
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: {},
          newReferral: { _id: 'org1', name: 'Organisation1' },
          referralType: 'org',
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
        }));
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { type: 1, description: 1, title: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(1);
      expect(activities[0].type).to.equal(ACTIVITY_TYPES.EVENT);
      expect(activities[0].title).to.equal('Changement de referral');
      expect(activities[0].description).to.equal('Organisation1');
      expect(activities[0].metadata).to.deep.equal({
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: { _id: 'org2', name: 'Organisation2' },
          newReferral: { _id: 'org1', name: 'Organisation1' },
          referralType: 'org',
        },
      });
    });

    it('does not adds activity on the user when the referral does not change', async () => {
      UserService.update({
        userId: 'user',
        object: { referredByOrganisationLink: 'org2' },
      });
      await ddpWithUserId('admin', () =>
        setUserReferredByOrganisation.run({ userId: 'user', organisationId: 'org2' }));
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { type: 1, description: 1, title: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(0);
    });
  });
});
