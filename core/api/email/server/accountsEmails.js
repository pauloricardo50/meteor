import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import ActivityService from '../../activities/server/ActivityService';
import { createMeteorAsyncFunction } from '../../helpers';
import { EMAIL_IDS, EMAIL_PARTS, FROM_DEFAULT } from '../emailConstants';
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
      to: [{ email: address }],
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

  // Don't do this in tests, as it throws in nodemailer
  // https://github.com/nodemailer/nodemailer/issues/615
  // Don't do this locally either, there's no point
  if (reason === 'enrollAccount' && !Meteor.isTest && !Meteor.isDevelopment) {
    return {
      ...defaultOptions,
      attachments: [
        {
          filename: 'e-Potek - Guide du financement hypothécaire.pdf',
          path: encodeURI(
            `${Meteor.settings.public.subdomains.backend}/files/e-Potek - Guide du financement hypothécaire.pdf`,
          ),
        },
      ],
    };
  }

  return defaultOptions;
};
