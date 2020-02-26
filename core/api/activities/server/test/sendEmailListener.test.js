/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { checkEmails } from '../../../../utils/testHelpers/index';
import { EMAIL_IDS } from '../../../email/emailConstants';
import { sendEmail, sendEmailToAddress } from '../../../email/server/methods';
import generator from '../../../factories/server';
import UserService from '../../../users/server/UserService';

import { ACTIVITY_TYPES } from '../../activityConstants';
import ActivityService from '../ActivityService';

describe('sendEmailListener', function() {
  this.timeout(10000);

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
      await sendEmail.serverRun({
        emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
        userId: 'user',
        params: {
          proName: 'Pro Name',
          address: 'Rue du test 1',
          ctaUrl: 'www.e-potek.ch',
          multiple: false,
        },
      });

      await checkEmails(1);
      const { activities = [] } = UserService.get('user', {
        activities: { type: 1, title: 1, description: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(1);
      expect(activities[0]).to.deep.include({
        type: ACTIVITY_TYPES.EMAIL,
        title: 'Email envoyé',
        description: 'E-Potek - Rue du test 1, de team@e-potek.ch',
      });
      expect(activities[0].metadata).to.deep.include({
        emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
        to: 'john.doe@test.com',
        from: 'team@e-potek.ch',
      });
      expect(activities[0].metadata.response).to.deep.include({
        status: 'sent',
      });
    });
  });

  describe('sendEmailToAddress', () => {
    it('adds activity on the user', async () => {
      await sendEmailToAddress.serverRun({
        emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
        address: 'john.doe@test.com',
        params: {
          proName: 'Pro Name',
          address: 'Rue du test 1',
          ctaUrl: 'www.e-potek.ch',
          multiple: false,
        },
      });

      await checkEmails(1);
      const { activities = [] } = UserService.get('user', {
        activities: { type: 1, title: 1, description: 1, metadata: 1 },
      });

      expect(activities.length).to.equal(1);
      expect(activities[0]).to.deep.include({
        type: ACTIVITY_TYPES.EMAIL,
        title: 'Email envoyé',
        description: 'E-Potek - Rue du test 1, de team@e-potek.ch',
      });
      expect(activities[0].metadata).to.deep.include({
        emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
        to: 'john.doe@test.com',
        from: 'team@e-potek.ch',
      });
      expect(activities[0].metadata.response).to.deep.include({
        status: 'sent',
      });
    });

    it('does not throw if no user is registered with address', async () =>
      expect(async () => {
        await sendEmailToAddress.serverRun({
          emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
          address: 'john2.doe@test.com',
          params: {
            proName: 'Pro Name',
            address: 'Rue du test 1',
            ctaUrl: 'www.e-potek.ch',
            multiple: false,
          },
        });
        await checkEmails(1);
      }).to.not.throw());
    const activities = ActivityService.fetch();
    expect(activities.length).to.equal(0);
  });
});
