import { expect } from 'chai';

import { checkEmails, resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { EMAIL_IDS, EMAIL_TEMPLATES } from '../../emailConstants';
import EmailService, { isEmailTestEnv } from '../EmailService';
import { setupMandrill } from '../mandrill';

/* eslint-env mocha */

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
    it('should not throw', async () => {
      generator({ users: { _id: 'userId', _factory: 'user' } });
      const emailId = EMAIL_IDS.ENROLL_ACCOUNT;
      const template = await EmailService.getAccountsTemplate({
        emailId,
        params: {
          user: { _id: 'userId' },
          url: 'stuff/enroll-account/hello',
        },
      });
      expect(() =>
        EmailService.renderTemplate(template, emailId),
      ).to.not.throw();
    });
  });
});
