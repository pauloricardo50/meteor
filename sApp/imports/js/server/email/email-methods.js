import { Meteor } from 'meteor/meteor';
import rateLimit from '/imports/js/helpers/rate-limit.js';
import { Mandrill } from 'meteor/wylio:mandrill';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import {
  from,
  fromEmail,
  defaultCTA_URL,
  emailFooter,
  getEmailContent,
} from './email-defaults';
import { addEmail, modifyEmail } from 'core/api/loanrequests/methods';

export const sendEmail = new ValidatedMethod({
  name: 'email.send',
  mixins: [CallPromiseMixin],
  validate({
    emailId,
    requestId,
    template = 'notification',
    CTA_URL,
    sendAt,
    userId,
    intlValues,
  }) {
    check(emailId, String);
    check(requestId, String);
    check(template, Match.Optional(String));
    check(CTA_URL, Match.Optional(String));
    check(sendAt, Match.Optional(Date));
    check(userId, Match.Optional(String));
    check(intlValues, Match.Optional(Object));
  },
  run({
    emailId,
    requestId,
    template = 'notification',
    CTA_URL,
    sendAt,
    userId,
    intlValues,
  }) {
    const { email, subject, title, body, CTA } = getEmailContent(
      emailId,
      intlValues,
    );
    let toEmail;

    // When this is sent by an admin, use the userId to find the email to whom this should be sent to
    if (userId) {
      toEmail = Meteor.users.findOne(userId).emails[0].address;
    }
    toEmail = toEmail || email;

    // If this is a demo site, do not send emails
    if (
      this.connection &&
      this.connection.httpHeaders &&
      this.connection.httpHeaders.host.indexOf('demo') !== -1
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
        merge_vars: [
          {
            rcpt: toEmail,
            vars: [
              { name: 'title', content: title },
              { name: 'body', content: body },
              { name: 'CTA', content: CTA },
              { name: 'CTA_URL', content: CTA_URL || defaultCTA_URL }, // overrides the global_merge_vars if it is set}
            ],
          },
        ],
        metadata: [{ userId: Meteor.userId(), requestId }],
      },
    };

    if (sendAt) {
      options.send_at = sendAt.toISOString();
    }

    // FIXME Mandrill can't be tested currently
    // https://github.com/Wylio/meteor-mandrill/issues/23
    if (Meteor.isTest) {
      return;
    }

    this.unblock();
    Mandrill.messages.sendTemplate(options, (error, result) => {
      if (error) {
        throw new Meteor.Error(error);
      }

      const content = JSON.parse(result.content)[0];
      return addEmail.call(
        {
          requestId,
          emailId,
          _id: content._id,
          status: content.status,
          sendAt,
        },
        (err) => {
          throw new Meteor.Error(err);
        },
      );
    });
  },
});

export const cancelScheduledEmail = new ValidatedMethod({
  name: 'email.cancelScheduled',
  mixins: [CallPromiseMixin],
  validate({ id, requestId }) {
    check(id, String);
    check(requestId, String);
  },
  run({ id, requestId }) {
    this.unblock();
    Mandrill.messages.cancelScheduled({ id }, (error, result) => {
      if (error) {
        throw new Meteor.Error(error);
      }

      const content = JSON.parse(result.content);
      return modifyEmail.call(
        { requestId, _id: content._id, status: 'cancelled' },
        (err) => {
          throw new Meteor.Error(err);
        },
      );
    });
  },
});

export const rescheduleEmail = new ValidatedMethod({
  name: 'email.reschedule',
  mixins: [CallPromiseMixin],
  validate({ id, requestId, date }) {
    check(id, String);
    check(requestId, String);
    check(date, Date);
  },
  run({ id, requestId, date }) {
    this.unblock();
    Mandrill.messages.reschedule(
      { id, send_at: date.toISOString() },
      (error, result) => {
        if (error) {
          throw new Meteor.Error(error);
        }

        const content = JSON.parse(result.content);
        return modifyEmail.call(
          { requestId, _id: content._id, sendAt },
          (err) => {
            throw new Meteor.Error(err);
          },
        );
      },
    );
  },
});

// Send max 1 email per second
rateLimit({
  methods: [sendEmail, cancelScheduledEmail, rescheduleEmail],
  limit: 1,
  timeRange: 1000,
});
