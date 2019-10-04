/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { checkEmails } from '../../../../utils/testHelpers';
import { EMAIL_IDS, EMAIL_TEMPLATES } from '../../emailConstants';
import EmailService, { isEmailTestEnv } from '../EmailService';
import { setupMandrill } from '../mandrill';

setupMandrill();

describe('EmailService', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  it('emailTestEnv should be true', () => {
    expect(isEmailTestEnv).to.equal(true);
  });

  describe('renderTemplate', () => {
    it('should not throw', () => {
      const emailId = EMAIL_IDS.ENROLL_ACCOUNT;
      const template = EmailService.getAccountsTemplate(emailId, {
        user: { roles: 'user' },
        url: 'stuff/enroll-account/hello',
      });
      expect(() =>
        EmailService.renderTemplate(template, emailId)).to.not.throw();
    });
  });

  describe('sendEmail', () => {
    it('should add emails in the test database and send them with the test key', () => {
      const address = 'florian@e-potek.ch';

      return EmailService.sendEmail({
        emailId: EMAIL_IDS.CONTACT_US,
        address,
        params: { name: 'Florian Bienefelt' },
      }).then(() =>
        checkEmails(1).then((emails) => {
          expect(emails.length).to.equal(1);
          expect(emails[0]).to.deep.include({
            emailId: EMAIL_IDS.CONTACT_US,
            address,
          });
          expect(emails[0].template.template_name).to.equal(EMAIL_TEMPLATES.NOTIFICATION.mandrillId);
          expect(emails[0].response.status).to.equal('sent');
        }));
    });
  });
});
