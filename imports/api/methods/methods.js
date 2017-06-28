import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import rateLimit from '/imports/js/helpers/rate-limit.js';

export const sendEmail = new ValidatedMethod({
  name: 'sendEmail',
  validate({ emailId, template, CTA_URL }) {
    check(emailId, String);
    check(template, String);
    check(CTA_URL, String);
  },
  run(object) {
    Meteor.call('email.send', object, error => {
      if (error) {
        throw new Meteor.Error('error sending email', error);
      }
    });
  },
});

rateLimit({ methods: [sendEmail], limit: 1, timeRange: 1000 });
