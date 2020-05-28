import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import SimpleSchema from 'simpl-schema';

import { Method } from '../../methods/methods';
import SecurityService from '../../security';
import UserService from '../../users/server/UserService';
import {
  getNewsletterStatus,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  updateNewsletterProfile,
} from '../methodDefinitions';
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

subscribeToNewsletter.setHandler((context, { email }) => {
  if (!SimpleSchema.RegEx.Email.test(email)) {
    throw new Meteor.Error('Email invalide');
  }
  context.unblock();

  return MailchimpService.subscribeMember({ email });
});

unsubscribeFromNewsletter.setHandler((context, { email }) => {
  const user = UserService.getByEmail(email, { _id: 1 });
  SecurityService.users.isAllowedToUpdate(user._id, context.userId);

  return MailchimpService.unsubscribeMember({ email });
});

updateNewsletterProfile.setHandler((context, { userId, status }) => {
  SecurityService.users.isAllowedToUpdate(userId, context.userId);
  const {
    email,
    firstName,
    lastName,
    mainOrganisation,
    phoneNumber,
  } = UserService.get(userId, {
    email: 1,
    firstName: 1,
    lastName: 1,
    mainOrganisation: 1,
    phoneNumber: 1,
  });
  return MailchimpService.upsertMember({
    email,
    firstName,
    lastName,
    organisation: mainOrganisation?.name,
    phoneNumber,
    status,
  });
});
