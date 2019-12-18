import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import ActivityService from 'core/api/activities/server/ActivityService';
import { createMeteorAsyncFunction } from 'core/api/helpers/index';
import getPublicServerFile from 'core/utils/server/getPublicServerFile';
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
    const getAccountsTemplate = createMeteorAsyncFunction(
      EmailService.getAccountsTemplate.bind(EmailService),
    );
    const template = getAccountsTemplate({
      emailId,
      params: {
        user,
        url,
      },
    });
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

Accounts.emailTemplates.verifyEmail = createAccountsEmailConfig(
  EMAIL_IDS.VERIFY_EMAIL,
);
Accounts.emailTemplates.resetPassword = createAccountsEmailConfig(
  EMAIL_IDS.RESET_PASSWORD,
);
Accounts.emailTemplates.enrollAccount = createAccountsEmailConfig(
  EMAIL_IDS.ENROLL_ACCOUNT,
);

// Hack Meteor accounts functions to allow adding attachments meteor emails
const defaultGenerateOptionsForEmail = Accounts.generateOptionsForEmail;
Accounts.generateOptionsForEmail = (email, user, url, reason) => {
  const defaultOptions = defaultGenerateOptionsForEmail(
    email,
    user,
    url,
    reason,
  );

  if (reason === 'enrollAccount') {
    return {
      ...defaultOptions,
      attachments: [
        {
          filename: 'e-Potek - Guide du financement hypothécaire.pdf',
          path: `${Meteor.settings.public.subdomains.backend}/files/e-Potek - Guide du financement hypothécaire.pdf`,
        },
      ],
    };
  }

  return defaultOptions;
};
