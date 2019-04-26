import { Mandrill } from 'meteor/wylio:mandrill';
import { Meteor } from 'meteor/meteor';

import { getEmailFooter } from './emailHelpers';
import { isEmailTestEnv, skipEmails } from './EmailService';

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

const makeRecipients = (recipients, bccAdresses = []) => [
  ...recipients.map(({ email, name }) => ({ email, name, type: 'to' })),
  ...bccAdresses.map(({ email, name }) => ({ email, name, type: 'bcc' })),
];

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
  bccAddresses,
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
    to: makeRecipients(
      [{ email: recipientAddress, name: recipientName }],
      bccAddresses,
    ),
    merge_vars: [{ rcpt: recipientAddress, vars: variables }],
    headers: {
      'Reply-To': replyTo || senderAddress,
    },
  },
  send_at: sendAt ? sendAt.toISOString() : undefined,
});

export const renderMandrillTemplate = mandrillTemplate =>
  Mandrill.templates.render(mandrillTemplate);

export const sendMandrillTemplate = (mandrillTemplate) => {
  if (skipEmails) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    Mandrill.messages.sendTemplate(mandrillTemplate, (error, result) => {
      if (error) {
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
          console.log('error', error);
          resolve(error);
        } else if (result.statusCode !== 200) {
          resolve(result);
        }
        resolve(result.data);
      },
    ));
