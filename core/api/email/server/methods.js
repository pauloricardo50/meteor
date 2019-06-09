import { Meteor } from 'meteor/meteor';

import { sendEmail, sendEmailToAddress } from '../methodDefinitions';
import EmailService from './EmailService';

sendEmail.setHandler((context, params) => {
  context.unblock();
  try {
    return EmailService.sendEmailToUser(params);
  } catch (error) {
    console.log(`EmailService error for ${params.emailId}`, error);
    throw new Meteor.Error(error);
  }
});

sendEmailToAddress.setHandler((context, params) => {
  context.unblock();
  try {
    return EmailService.sendEmail(params);
  } catch (error) {
    console.log(`EmailService error for ${params.emailId}`, error);
    throw new Meteor.Error(error);
  }
});
