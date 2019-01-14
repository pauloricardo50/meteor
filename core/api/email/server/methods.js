import { Meteor } from 'meteor/meteor';

import { sendEmail, sendEmailToAddress } from '../methodDefinitions';
import EmailService from './EmailService';

sendEmail.setHandler((context, { emailId, userId, params }) => {
  console.log('userId', userId);
  context.unblock();
  try {
    EmailService.sendEmailToUser({ emailId, userId, params });
  } catch (error) {
    console.log(`EmailService error for ${emailId}`, error);
    throw new Meteor.Error(error);
  }
});

sendEmailToAddress.setHandler((context, { emailId, address, params }) => {
  context.unblock();
  try {
    EmailService.sendEmail({ emailId, address, params });
  } catch (error) {
    console.log(`EmailService error for ${emailId}`, error);
    throw new Meteor.Error(error);
  }
});
