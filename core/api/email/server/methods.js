import { sendEmail } from '../methodDefinitions';
import EmailService from './EmailService';

sendEmail.setHandler((context, { emailId, userId, params }) => {
  context.unblock();
  try {
    EmailService.sendEmailToUser(emailId, userId, params);
  } catch (error) {
    throw error;
  }
});
