import { Meteor } from 'meteor/meteor';
import emailConfigs from './emailConfigs';
import { getEmailContent, getEmailPart } from './emailHelpers';
import {
  sendMandrillTemplate,
  getMandrillTemplate,
  getSimpleMandrillTemplate,
  renderMandrillTemplate,
} from './mandrill';
import { FROM_NAME, FROM_EMAIL } from '../emailConstants';

class EmailService {
  sendEmail = (emailId, address, params) => {
    const templateOptions = this.createTemplateOptions({
      emailId,
      address,
      params,
    });
    const template = this.getTemplate(templateOptions);
    if (Meteor.isDevelopment || Meteor.isTest) {
      this.emailLogger({ emailId, address, template });
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

  createTemplateOptions = ({ emailId, address, params }) => {
    const emailConfig = this.getEmailConfig(emailId);
    const { template: { mandrillId }, createIntlValues } = emailConfig;

    const intlValues = createIntlValues(params);
    const emailContent = getEmailContent(emailId, intlValues);

    // Make sure you call `createOverrides` from emailConfig, to preserve `this`
    // See: https://github.com/Microsoft/vscode/issues/43930
    const { variables, allowUnsubscribe } = emailConfig.createOverrides(
      params,
      emailContent,
    );

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

  getAccountsTemplate = (emailId, params = {}) => {
    const templateOptions = this.createTemplateOptions({ emailId, params });
    return getSimpleMandrillTemplate(templateOptions);
  };

  getTemplate = templateOptions => getMandrillTemplate(templateOptions);

  getEmailPart = (emailId, part) => getEmailPart({ emailId, part });

  renderTemplate = (templateOptions, emailId) => {
    let result;
    this.emailLogger({ emailId, template: templateOptions });

    try {
      result = renderMandrillTemplate(templateOptions);
    } catch (error) {
      throw new Meteor.Error(
        'MANDRILL_ERROR',
        `Error while rendering mandrill template for ${emailId}`,
        error.reason || error.message || error,
      );
    }

    return result;
  };

  emailLogger = ({ emailId, address, template }) => {
    if (Meteor.isDevelopment || Meteor.isTest) {
      if (address) {
        console.log(`EmailService: Sending ${emailId} to ${address} with this template:`);
      } else {
        console.log(`EmailService: Sending ${emailId} with this template:`);
      }
      console.log(template);
    }
  };
}

export default new EmailService();
