import { sendEmail, sendEmailToAddress } from '../methodDefinitions';
import EmailService from './EmailService';

sendEmail.setHandler((context, { emailId, userId, params }) => {
  context.unblock();
  try {
    EmailService.sendEmailToUser(emailId, userId, params);
  } catch (error) {
    throw error;
  }
});

sendEmailToAddress.setHandler((context, { emailId, address, params }) => {
  context.unblock();
  try {
    EmailService.sendEmail(emailId, address, params);
  } catch (error) {
    throw error;
  }
});
