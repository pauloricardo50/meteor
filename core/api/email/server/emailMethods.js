import { Meteor } from 'meteor/meteor';
import EmailService from './EmailService';

export const SEND_EMAIL = 'SEND_EMAIL';

Meteor.methods({
  [SEND_EMAIL]({ emailId, userId, params }) {
    this.unblock();
    EmailService.sendEmailToUser(emailId, userId, params);
  },
});
