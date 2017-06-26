import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import rateLimit from '/imports/js/helpers/rate-limit.js';
import { Mandrill } from 'meteor/wylio:mandrill';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import LoanRequests from '/imports/api/loanrequests/loanrequests';

import formatMessage from './intl';

// Defaults
const from = "Yannis d'e-Potek";
const fromEmail = 'info@e-potek.ch';
const defaultCTA_URL = 'https://www.e-potek.ch/app';

/**
 * emailFooter - Returns the default email footer for all emails
 *
 * @param {boolean} [unsubscribe=true] Whether to show an unsubscribe line or not
 *
 * @return {type} a HTML string
 */

const emailFooter = (unsubscribe = true) => {
  return formatMessage('emails.footer', {
    copyright: '<em>&copy; *|CURRENT_YEAR|* e-Potek</em><br /><br />',
    url: '<a href="http://e-potek.ch" target="_blank">www.e-potek.ch</a><br />',
    unsubscribe: unsubscribe
      ? `<a href="*|UNSUB|*">${formatMessage('emails.unsubscribe')}</a>`
      : '',
  });
};

/**
 * getEmailContent - Returns all the fields for an email
 *
 * @param {String} emailId an id representing what email this is, example:
 * auctionEnded, verificationRequested
 *
 * @return {Object} contains all the fields
 */
const getEmailContent = emailId => {
  const subject = formatMessage(`emails.${emailId}.subject`);
  const title = formatMessage(`emails.${emailId}.title`);
  const body = formatMessage(`emails.${emailId}.body`);
  const CTA = formatMessage(`emails.${emailId}.CTA`);
  const fromCustom = formatMessage(`emails.${emailId}.from`);
  const email = Meteor.user() && Meteor.user().emails[0].address;

  return { email, subject, title, body, CTA, from: fromCustom };
};

/**
 * emailCallback - Is called after an email is sent to store it in the DB
 *
 * @param {type}   error            Mandrill error
 * @param {type}   result           Mandrill result
 * @param {type}   requestId        the request this email is sent for
 * @param {type}   emailId          the email that was sent
 * @param {type}   callback         an optional callback
 * @param {string} [operation=push] Is this a new email, or is it updating an
 * existing one. oneOf `push`, or `update`
 *
 * @return {type} Description
 */
const emailCallback = (error, result, requestId, emailId, operation = 'push') => {
  if (error) {
    console.log(error);
  }

  const content = JSON.parse(result.content)[0];

  if (operation === 'update') {
    return LoanRequests.update(
      { _id: requestId, 'emails._id': content._id },
      { $update: { 'emails.$': { status: content.status, lastUpdated: new Date() } } },
      (err, res) => {
        if (err) {
          console.log(err);
        }
      },
    );
  }
  return LoanRequests.update(
    requestId,
    {
      $push: {
        emails: { emailId, _id: content._id, status: content.status, lastUpdated: new Date() },
      },
    },
    (err, res) => {
      if (err) {
        console.log(err);
      }
    },
  );
};

export const sendEmail = new ValidatedMethod({
  name: 'email.send',
  validate({ emailId, requestId, template = 'notification', CTA_URL, sendAt, userId }) {
    check(emailId, String);
    check(requestId, String);
    check(template, Match.Optional(String));
    check(CTA_URL, Match.Optional(String));
    check(sendAt, Match.Optional(Date));
    check(userId, Match.Optional(String));
  },
  run({ emailId, requestId, template = 'notification', CTA_URL, sendAt, userId }) {
    const { email, subject, title, body, CTA } = getEmailContent(emailId);
    let toEmail;
    if (userId) {
      toEmail = Meteor.users.findOne(userId).emails[0].address;
    }
    toEmail = toEmail || email;

    // If this is a demo site, do not send emails
    if (
      this.connection &&
      this.connection.httpHeaders &&
      this.connection.httpHeaders.host.indexOf('demo')
    ) {
      return false;
    }

    const options = {
      template_name: template,
      template_content: [{ name: 'footer', content: emailFooter() }],
      message: {
        from_email: fromEmail,
        from_name: from,
        subject,
        to: [
          {
            email: toEmail,
            // name: 'Jon Snow',
            type: 'to',
          },
        ],
        global_merge_vars: [{ name: 'CTA_URL', content: defaultCTA_URL }],
        merge_vars: [
          {
            rcpt: toEmail,
            vars: [
              { name: 'title', content: title },
              { name: 'body', content: body },
              { name: 'CTA', content: CTA },
              { name: 'CTA_URL', content: CTA_URL }, // overrides the global_merge_vars if it is set}
            ],
          },
        ],
        metadata: [{ userId: Meteor.user()._id, requestId }],
      },
    };

    if (sendAt) {
      options.send_at = sendAt.toISOString();
    }

    this.unblock();
    Mandrill.messages.sendTemplate(options, (error, result) =>
      emailCallback(error, result, requestId, emailId),
    );
  },
});

export const cancelScheduledEmail = new ValidatedMethod({
  name: 'email.cancelScheduled',
  validate({ id, requestId }) {
    check(id, String);
    check(requestId, String);
  },
  run({ id, requestId }) {
    this.unblock();
    Mandrill.messages.cancelScheduled({ id }, (error, result) =>
      emailCallback(error, result, requestId, undefined, 'update'),
    );
  },
});

export const rescheduleEmail = new ValidatedMethod({
  name: 'email.reschedule',
  validate({ id, requestId, date }) {
    check(id, String);
    check(requestId, String);
    check(date, Date);
  },
  run({ id, requestId, date }) {
    this.unblock();
    Mandrill.messages.reschedule({ id, send_at: date.toISOString() }, (error, result) =>
      emailCallback(error, result, requestId, undefined, 'update'),
    );
  },
});

// Send max 1 email per second
rateLimit({
  methods: [sendEmail, cancelScheduledEmail, rescheduleEmail],
  limit: 1,
  timeRange: 1000,
});

// Meteor default emails
// https://themeteorchef.com/tutorials/sign-up-with-email-verification
Accounts.emailTemplates.siteName = 'e-Potek';
Accounts.emailTemplates.from = `${from} <${fromEmail}>`;

Accounts.emailTemplates.verifyEmail = {
  subject: () => getEmailContent('verifyEmail').subject,
  html: (user, url) => {
    const urlWithoutHash = url.replace('#/', '');
    let result;

    try {
      result = Mandrill.templates.render({
        template_name: 'welcome',
        template_content: [{ name: 'footer', content: emailFooter(false) }], // no footer
        merge_vars: [{ name: 'VERIFICATION_URL', content: urlWithoutHash }],
        metadata: [{ userId: user._id }],
      });
    } catch (error) {
      throw new Meteor.Error('Error while rendering Mandrill template', error);
    }
    return result.data.html;
  },
};

Accounts.emailTemplates.resetPassword = {
  from: () => `${getEmailContent('resetPassword').from} <${fromEmail}>`,
  subject: () => getEmailContent('resetPassword').subject,
  html: (user, url) => {
    const urlWithoutHash = url.replace('#/', '');
    const { title, body, CTA } = getEmailContent('resetPassword');
    let result;

    try {
      result = Mandrill.templates.render({
        template_name: 'notification',
        template_content: [{ name: 'footer', content: emailFooter(false) }], // no footer
        merge_vars: [
          { name: 'title', content: title },
          { name: 'body', content: body },
          { name: 'CTA', content: CTA },
          { name: 'CTA_URL', content: urlWithoutHash },
        ],
        metadata: [{ userId: user._id }],
      });
    } catch (error) {
      throw new Meteor.Error('Error while rendering Mandrill template', error);
    }
    return result.data.html;
  },
};
