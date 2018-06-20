import { Accounts } from 'meteor/accounts-base';

import { FROM_DEFAULT, EMAIL_IDS, EMAIL_PARTS } from '../emailConstants';
import EmailService from './EmailService';

// Meteor default emails
// https://themeteorchef.com/tutorials/sign-up-with-email-verification
Accounts.emailTemplates.siteName = 'e-Potek';
Accounts.emailTemplates.from = FROM_DEFAULT;

export const createAccountsEmailConfig = emailId => ({
  subject: () => EmailService.getEmailPart(emailId, EMAIL_PARTS.SUBJECT),
  html(user, url) {
    console.log('create accounts config context:', this);

    // TODO: Make sure this doesn't block
    const template = EmailService.getAccountsTemplate(emailId, { user, url });
    const result = EmailService.renderTemplate(template, emailId);
    return result.data.html;
  },
});

Accounts.emailTemplates.verifyEmail = createAccountsEmailConfig(EMAIL_IDS.VERIFY_EMAIL);
Accounts.emailTemplates.resetPassword = createAccountsEmailConfig(EMAIL_IDS.RESET_PASSWORD);
Accounts.emailTemplates.enrollAccount = createAccountsEmailConfig(EMAIL_IDS.ENROLL_ACCOUNT);
