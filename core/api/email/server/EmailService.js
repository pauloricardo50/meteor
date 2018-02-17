import { Meteor } from 'meteor/meteor';

class EmailService {
  sendEmail = (address) => {
    if (Meteor.isDevelopment || Meteor.isTest) {
      console.log(`Sending email to ${address}`);
    } else {
      // Actually send email
    }
  };
}

export default EmailService;
