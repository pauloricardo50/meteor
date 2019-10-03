/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { EMAIL_IDS } from 'core/api/email/emailConstants';
import { checkEmails } from 'core/utils/testHelpers/index';
import { sendEmail, sendEmailToAddress } from '../../../methods';
import generator from '../../../factories';
import UserService from '../../../users/server/UserService';
import { ddpWithUserId } from '../../../methods/server/methodHelpers';

import { ACTIVITY_TYPES } from '../../activityConstants';

describe('sendEmailListener', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        {
          _id: 'user',
          emails: [{ address: 'john.doe@test.com', verified: true }],
        },
        {
          _id: 'admin',
          _factory: 'admin',
          firstName: 'Admin',
          lastName: 'E-Potek',
        },
      ],
    });
  });

  describe('sendEmailToUser', () => {
    it('adds activity on the user', async () => {
      await ddpWithUserId('admin', () =>
        sendEmail.run({
          emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
          userId: 'user',
          params: {
            proName: 'Pro Name',
            address: 'Rue du test 1',
            ctaUrl: 'www.e-potek.ch',
            multiple: false,
          },
        }));

      await checkEmails();
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { type: 1, title: 1, description: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(1);
      expect(activities[0].type).to.equal(ACTIVITY_TYPES.EMAIL);
      expect(activities[0].title).to.equal('Email envoyé');
      expect(activities[0].description).to.equal('E-Potek - Rue du test 1, de info@e-potek.ch');
      expect(activities[0].metadata.emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROPERTY);
      expect(activities[0].metadata.to).to.equal('john.doe@test.com');
      expect(activities[0].metadata.from).to.equal('info@e-potek.ch');
      expect(activities[0].metadata.response.status).to.equal('sent');
    });
  });

  describe('sendEmailToAddress', () => {
    it('adds activity on the user', async () => {
      await ddpWithUserId('admin', () =>
        sendEmailToAddress.run({
          emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
          address: 'john.doe@test.com',
          params: {
            proName: 'Pro Name',
            address: 'Rue du test 1',
            ctaUrl: 'www.e-potek.ch',
            multiple: false,
          },
        }));

      await checkEmails();
      const { activities = [] } = UserService.fetchOne({
        $filters: { _id: 'user' },
        activities: { type: 1, title: 1, description: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(1);
      expect(activities[0].type).to.equal(ACTIVITY_TYPES.EMAIL);
      expect(activities[0].title).to.equal('Email envoyé');
      expect(activities[0].description).to.equal('E-Potek - Rue du test 1, de info@e-potek.ch');
      expect(activities[0].metadata.emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROPERTY);
      expect(activities[0].metadata.to).to.equal('john.doe@test.com');
      expect(activities[0].metadata.from).to.equal('info@e-potek.ch');
      expect(activities[0].metadata.response.status).to.equal('sent');
    });

    it('does not throw if no user is registered with address', async () =>
      expect(() => {
        ddpWithUserId('admin', async () => {
          await sendEmailToAddress.run({
            emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
            address: 'john2.doe@test.com',
            params: {
              proName: 'Pro Name',
              address: 'Rue du test 1',
              ctaUrl: 'www.e-potek.ch',
              multiple: false,
            },
          });
          await checkEmails();
        });
      }).to.not.throw());
  });
});
