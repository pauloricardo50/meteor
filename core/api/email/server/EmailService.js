import { Meteor } from 'meteor/meteor';
import emailConfigs from '../emailConfigs';
import { getEmailContent } from '../emailHelpers';
import {
  sendMandrillTemplate,
  getMandrillTemplate,
  getSimpleMandrillTemplate,
} from '../mandrill';
import { FROM_NAME, FROM_EMAIL } from '../emailConstants';

class EmailService {
  sendEmail = (emailId, address, params) => {
    const templateOptions = this.createTemplateOptions(
      emailId,
      address,
      params,
    );
    const template = this.getTemplate(templateOptions);
    if (Meteor.isDevelopment || Meteor.isTest) {
      console.log(`EmailService in development env: Sending ${emailId} to ${address} with this template: ${template}`);
    } else {
      sendMandrillTemplate(template);
    }
  };

  sendEmailToUser = (emailId, userId, params) => {
    const user = Meteor.users.findOne(userId);
    const emailAddress = user && user.emails[0].address;
    this.sendEmail(emailId, emailAddress, params);
  };

  sendEmailToLoggedInUser = (emailId, params) => {
    this.sendEmailToUser(emailId, Meteor.userId(), params);
  };

  getEmailConfig = emailId => emailConfigs[emailId];

  createTemplateOptions = (emailId, address, params) => {
    const emailConfig = this.getEmailConfig(emailId);
    const { template: { mandrillId }, allowUnsubscribe = false } = emailConfig;
    const emailContent = getEmailContent(emailId);
    const { variables } = emailConfig.createOverrides(params, emailContent);

    return {
      templateName: mandrillId,
      allowUnsubscribe,
      variables,
      recipientAddress: address,
      senderAddress: FROM_EMAIL,
      senderName: FROM_NAME,
      subject: emailContent.subject,
      sendAt: undefined,
    };
  };

  getAccountsTemplate = templateOptions =>
    getSimpleMandrillTemplate(templateOptions);

  getTemplate = templateOptions => getMandrillTemplate(templateOptions);
}

export default EmailService;
