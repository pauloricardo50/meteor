import { Accounts } from 'meteor/accounts-base';

import ActivityService from 'core/api/activities/server/ActivityService';
import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import { FROM_DEFAULT, EMAIL_IDS, EMAIL_PARTS } from '../emailConstants';
import EmailService from './EmailService';

// Meteor default emails
// https://themeteorchef.com/tutorials/sign-up-with-email-verification
Accounts.emailTemplates.siteName = 'e-Potek';
Accounts.emailTemplates.from = FROM_DEFAULT;

export const createAccountsEmailConfig = emailId => ({
  subject: () => EmailService.getEmailPart(emailId, EMAIL_PARTS.SUBJECT),
  html(user, url) {
    // TODO: Make sure this doesn't block
    const template = EmailService.getAccountsTemplate(emailId, { user, url });
    const result = EmailService.renderTemplate(template, emailId);

    const { emails = [] } = user;
    const [email = {}] = emails;
    const { address } = email;
    const { merge_vars: mergeVars = [] } = template;
    const title = mergeVars.find(({ name }) => name === 'TITLE');
    const description = title
      ? `${title.content}, de ${Accounts.emailTemplates.from}`
      : `${emailId}, de ${Accounts.emailTemplates.from}`;

    ActivityService.addEmailActivity({
      emailId,
      to: address,
      from: Accounts.emailTemplates.from,
      isServerGenerated: true,
      userLink: { _id: user._id },
      title: 'Email envoyé',
      description,
    });

    return result.data.html;
  },
});

Accounts.emailTemplates.verifyEmail = createAccountsEmailConfig(EMAIL_IDS.VERIFY_EMAIL);
Accounts.emailTemplates.resetPassword = createAccountsEmailConfig(EMAIL_IDS.RESET_PASSWORD);
Accounts.emailTemplates.enrollAccount = createAccountsEmailConfig(EMAIL_IDS.ENROLL_ACCOUNT);
