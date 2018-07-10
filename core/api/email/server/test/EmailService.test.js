/* eslint-env mocha */
import { expect } from 'chai';

import { EMAIL_IDS } from '../../emailConstants';
import EmailService from '../EmailService';
import { setupMandrill } from '../mandrill';

setupMandrill();

describe('EmailService', () => {
  describe('renderTemplate', () => {
    it('should not throw', (done) => {
      const emailId = EMAIL_IDS.ENROLL_ACCOUNT;
      const template = EmailService.getAccountsTemplate(emailId, {
        user: { roles: 'user' },
        url: 'stuff/enroll-account/hello',
      });
      expect(() =>
        EmailService.renderTemplate(template, emailId)).to.not.throw();

      done();
    });
  });
});
