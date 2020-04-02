import { Meteor } from 'meteor/meteor';

import { logError } from '../../slack/methodDefinitions';
import { getEmailFooter } from './emailHelpers';
import { isEmailTestEnv, skipEmails } from './EmailService';
import Mandrill from './MandrillService';

export const setupMandrill = () => {
  let key = '';
  if (isEmailTestEnv) {
    key = Meteor.settings.mandrill.MANDRILL_API_KEY_TEST;
  } else {
    key = Meteor.settings.mandrill.MANDRILL_API_KEY;
  }

  Mandrill.config({
    username: Meteor.settings.mandrill.MANDRILL_LOGIN, // the email address you log into Mandrill with. Only used to set MAIL_URL.
    key, // get your Mandrill key from https://mandrillapp.com/settings/index
    port: 587, // defaults to 465 for SMTP over TLS
    host: 'smtps.mandrillapp.com', // the SMTP host
    // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
  });
};

// Used for Meteor Accounts emails
export const getSimpleMandrillTemplate = ({
  templateName,
  footerType,
  allowUnsubscribe,
  variables,
}) => ({
  template_name: templateName,
  template_content: [
    { name: 'footer', content: getEmailFooter(footerType, allowUnsubscribe) },
  ],
  merge_vars: variables,
});

// Used for all other emails
export const getMandrillTemplate = ({
  templateName,
  footerType,
  allowUnsubscribe,
  variables,
  recipientAddress,
  recipientName,
  senderAddress,
  senderName,
  subject,
  sendAt,
  templateContent = [],
  replyTo,
  mainRecipientIsBcc = true,
  bccAddresses = [],
  ccAddresses = [],
  attachments = [],
}) => ({
  template_name: templateName,
  template_content: [
    { name: 'footer', content: getEmailFooter(footerType, allowUnsubscribe) },
    ...templateContent,
  ],
  message: {
    from_email: senderAddress,
    from_name: senderName,
    subject,
    to: [
      {
        email: recipientAddress,
        name: recipientName,
        type: mainRecipientIsBcc ? 'bcc' : 'to',
      },
      ...ccAddresses.map(cc => ({ ...cc, type: 'cc' })),
      ...bccAddresses.map(bcc => ({ ...bcc, type: 'bcc' })),
    ],
    global_merge_vars: variables,
    headers: { 'Reply-To': replyTo || senderAddress },
    preserve_recipients: true,
    attachments: attachments.length ? attachments : undefined,
  },
  send_at: sendAt ? sendAt.toISOString() : undefined,
});
export const renderMandrillTemplate = mandrillTemplate =>
  Mandrill.templates.render(mandrillTemplate);

export const sendMandrillTemplate = mandrillTemplate => {
  if (skipEmails) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    Mandrill.messages.sendTemplate(mandrillTemplate, (error, result) => {
      if (error) {
        logError.run({
          error: JSON.parse(
            JSON.stringify(error, Object.getOwnPropertyNames(error)),
          ),
          additionalData: ['Mandrill error'],
        });
        reject(error);
      }
      resolve(result.data[0]);
    });
  });
};

const getDate30DaysAgo = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const dateString = date.toISOString().split('T')[0];
  return dateString;
};

export const getEmailsForAddress = email =>
  new Promise((resolve, reject) =>
    Mandrill.messages.search(
      { query: `email:${email}`, date_from: getDate30DaysAgo() },
      (error, result) => {
        if (error) {
          logError.run({
            error: JSON.parse(
              JSON.stringify(error, Object.getOwnPropertyNames(error)),
            ),
            additionalData: ['Mandrill error'],
          });
          resolve(error);
        } else if (result.statusCode !== 200) {
          resolve(result);
        }
        resolve(result.data);
      },
    ),
  );
