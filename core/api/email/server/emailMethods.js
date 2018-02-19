import { Meteor } from 'meteor/meteor';
import EmailService from './EmailService';

const SEND_EMAIL = 'SEND_EMAIL';

Meteor.methods({
  [SEND_EMAIL]({ emailId, userId, params }) {
    this.unblock();
    try {
      EmailService.sendEmailToUser(emailId, userId, params);
    } catch (error) {
      throw error;
    }
  },
});

export const sendEmail = params => Meteor.call(SEND_EMAIL, params);
