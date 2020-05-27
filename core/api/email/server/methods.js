import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import SimpleSchema from 'simpl-schema';

import { Method } from '../../methods/methods';
import SecurityService from '../../security';
import { subscribeToNewsletter } from '../methodDefinitions';
import EmailService from './EmailService';
import MailchimpService from './MailchimpService';

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

subscribeToNewsletter.setHandler(({ email }) => {
  if (!SimpleSchema.RegEx.Email.test(email)) {
    throw new Meteor.Error('Email invalide');
  }

  return MailchimpService.subscribeMember({ email });
});
