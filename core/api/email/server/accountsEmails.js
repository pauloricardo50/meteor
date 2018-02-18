import { Accounts } from 'meteor/accounts-base';

import { FROM_DEFAULT, EMAIL_IDS, EMAIL_PARTS } from '../emailConstants';
import EmailService from './EmailService';

// Meteor default emails
// https://themeteorchef.com/tutorials/sign-up-with-email-verification
Accounts.emailTemplates.siteName = 'e-Potek';
Accounts.emailTemplates.from = FROM_DEFAULT;

Accounts.emailTemplates.verifyEmail = (() => {
  const emailId = EMAIL_IDS.VERIFY_EMAIL;
  return {
    subject: () => EmailService.getEmailPart(emailId, EMAIL_PARTS.SUBJECT),
    html(user, url) {
      // TODO: Make sure this doesn't block
      const template = EmailService.getAccountsTemplate(emailId, { user, url });
      const result = EmailService.renderTemplate(template, emailId);
      return result.data.html;
    },
  };
})();

Accounts.emailTemplates.resetPassword = (() => {
  const emailId = EMAIL_IDS.RESET_PASSWORD;

  return {
    subject: () => EmailService.getEmailPart(emailId, EMAIL_PARTS.SUBJECT),
    html(user, url) {
      // TODO: Make sure this doesn't block
      const template = EmailService.getAccountsTemplate(emailId, { user, url });
      const result = EmailService.renderTemplate(template, emailId);
      return result.data.html;
    },
  };
})();

Accounts.emailTemplates.enrollAccount = (() => {
  const emailId = EMAIL_IDS.ENROLL_ACCOUNT;

  return {
    subject: () => EmailService.getEmailPart(emailId, EMAIL_PARTS.SUBJECT),
    html(user, url) {
      // TODO: Make sure this doesn't block
      const template = EmailService.getAccountsTemplate(emailId, { user, url });
      const result = EmailService.renderTemplate(template, emailId);
      return result.data.html;
    },
  };
})();
