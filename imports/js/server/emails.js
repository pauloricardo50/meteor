import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import rateLimit from '/imports/js/helpers/rate-limit.js';
import { Mandrill } from 'meteor/wylio:mandrill';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';

import formatMessage from './intl';

// TODO: internationalize this
const emailFooter = () => {
  return formatMessage('emails.footer', {
    copyright: '<em>&copy; *|CURRENT_YEAR|* e-Potek</em><br /><br />',
    url: '<a href="http://e-potek.ch" target="_blank">www.e-potek.ch</a><br />',
    unsubscribe: `<a href="*|UNSUB|*">${formatMessage('emails.unsubscribe')}</a>`,
  });
};
const from = "Yannis d'e-Potek";
const fromEmail = 'info@e-potek.ch';
const defaultCTA_URL = 'https://www.e-potek.ch/app';

const getEmail = emailId => {
  const subject = formatMessage(`emails.${emailId}.subject`);
  const title = formatMessage(`emails.${emailId}.title`);
  const body = formatMessage(`emails.${emailId}.body`);
  const CTA = formatMessage(`emails.${emailId}.CTA`);
  const fromCustom = formatMessage(`emails.${emailId}.from`);
  const email = Meteor.user() && Meteor.user().emails[0].address;

  return { email, subject, title, body, CTA, from: fromCustom };
};

const sendEmailServer = new ValidatedMethod({
  name: 'email.send',
  validate({ emailId, template = 'notification', CTA_URL }) {
    check(emailId, String);
    check(template, String);
    check(CTA_URL, String);
  },
  run({ emailId, template = 'notification', CTA_URL }) {
    const { email, subject, title, body, CTA } = getEmail(emailId);

    return Meteor.wrapAsync(() =>
      Mandrill.messages.sendTemplate({
        template_name: template,
        template_content: [{ name: 'footer', content: emailFooter() }],
        message: {
          from_email: email,
          from_name: fromEmail,
          subject,
          to: [
            {
              email,
              // name: 'Ryan Glover',
            },
          ],
          global_merge_vars: [
            { name: 'title', content: title },
            { name: 'body', content: body },
            { name: 'CTA', content: CTA },
            { name: 'CTA_URL', content: CTA_URL || defaultCTA_URL },
          ],
        },
      }),
    );
  },
});

// Send max 1 email per second
rateLimit({ methods: [sendEmailServer], limit: 1, timeRange: 1000 });

export default sendEmailServer;

// Meteor default emails
// https://themeteorchef.com/tutorials/sign-up-with-email-verification
Accounts.emailTemplates.siteName = 'e-Potek';
Accounts.emailTemplates.from = `${from} <${fromEmail}>`;

Accounts.emailTemplates.verifyEmail = {
  subject: () => getEmail('verifyEmail').subject,
  html: (user, url) => {
    const urlWithoutHash = url.replace('#/', '');
    let result;

    try {
      result = Mandrill.templates.render({
        template_name: 'welcome',
        template_content: [{ name: 'footer', content: emailFooter() }],
        merge_vars: [{ name: 'VERIFICATION_URL', content: urlWithoutHash }],
      });
    } catch (error) {
      throw new Meteor.Error('Error while rendering Mandrill template', error);
    }
    return result.data.html;
  },
};

Accounts.emailTemplates.resetPassword = {
  from: () => `${getEmail('resetPassword').from} <${fromEmail}>`,
  subject: () => getEmail('resetPassword').subject,
  html: (user, url) => {
    const urlWithoutHash = url.replace('#/', '');
    const { title, body, CTA } = getEmail('resetPassword');
    let result;

    try {
      result = Mandrill.templates.render({
        template_name: 'notification',
        template_content: [{ name: 'footer', content: emailFooter() }],
        merge_vars: [
          { name: 'title', content: title },
          { name: 'body', content: body },
          { name: 'CTA', content: CTA },
          { name: 'CTA_URL', content: urlWithoutHash },
        ],
      });
    } catch (error) {
      throw new Meteor.Error('Error while rendering Mandrill template', error);
    }
    return result.data.html;
  },
};
