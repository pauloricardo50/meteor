import { Mandrill } from 'meteor/wylio:mandrill';
import { Meteor } from 'meteor/meteor';

import { getEmailFooter } from './emailHelpers';

export const setupMandrill = () => {
  let key = '';
  if (Meteor.isTest) {
    key = Meteor.settings.MANDRILL_API_KEY_TEST;
  } else {
    key = Meteor.settings.MANDRILL_API_KEY;
  }

  Mandrill.config({
    username: Meteor.settings.MANDRILL_LOGIN, // the email address you log into Mandrill with. Only used to set MAIL_URL.
    key, // get your Mandrill key from https://mandrillapp.com/settings/index
    port: 587, // defaults to 465 for SMTP over TLS
    host: 'smtps.mandrillapp.com', // the SMTP host
    // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
  });
};

// Used for Meteor Accounts emails
export const getSimpleMandrillTemplate = (options) => {
  const { templateName, allowUnsubscribe, variables } = options;

  return {
    template_name: templateName,
    template_content: [
      { name: 'footer', content: getEmailFooter(allowUnsubscribe) },
    ],
    merge_vars: variables,
  };
};

// Used for all other emails
export const getMandrillTemplate = ({
  templateName,
  allowUnsubscribe,
  variables,
  recipientAddress,
  senderAddress,
  senderName,
  subject,
  sendAt,
}) => ({
  template_name: templateName,
  template_content: [
    { name: 'footer', content: getEmailFooter(allowUnsubscribe) },
  ],
  message: {
    from_email: senderAddress,
    from_name: senderName,
    subject,
    to: [{ email: recipientAddress, type: 'to' }],
    merge_vars: [{ rcpt: recipientAddress, vars: variables }],
  },
  send_at: sendAt ? sendAt.toISOString() : undefined,
});

export const renderMandrillTemplate = mandrillTemplate =>
  Mandrill.templates.render(mandrillTemplate);

export const sendMandrillTemplate = mandrillTemplate =>
  new Promise((resolve, reject) => {
    Mandrill.messages.sendTemplate(mandrillTemplate, (error, result) => {
      if (error) {
        reject(error);
      }
      const content = JSON.parse(result.content)[0];
      resolve(content);
    });
  });
