import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import SecurityService from 'core/api/security/index';
import { Method } from '../../methods/methods';
import EmailService from './EmailService';

export const sendEmail = new Method({
  name: 'sendEmail',
  params: {
    emailId: String,
    params: Object,
    userId: String,
  },
});
sendEmail.setHandler((context, params) => {
  SecurityService.checkIsInternalCall(context);
  context.unblock();
  try {
    return EmailService.sendEmailToUser(params);
  } catch (error) {
    console.log(`EmailService error for ${params.emailId}`, error);
    throw new Meteor.Error(error);
  }
});

export const sendEmailToAddress = new Method({
  name: 'sendEmailToAddress',
  params: {
    address: String,
    emailId: String,
    name: Match.Maybe(String),
    params: Object,
  },
});
sendEmailToAddress.setHandler((context, params) => {
  SecurityService.checkIsInternalCall(context);
  context.unblock();
  try {
    return EmailService.sendEmail(params);
  } catch (error) {
    console.log(`EmailService error for ${params.emailId}`, error);
    throw new Meteor.Error(error);
  }
});
