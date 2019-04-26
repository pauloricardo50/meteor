import { Meteor } from 'meteor/meteor';

import UserService from '../../users/server/UserService';
import emailConfigs from './emailConfigs';
import { getEmailContent, getEmailPart } from './emailHelpers';
import {
  sendMandrillTemplate,
  getMandrillTemplate,
  getSimpleMandrillTemplate,
  renderMandrillTemplate,
} from './mandrill';
import { FROM_NAME, FROM_EMAIL } from '../emailConstants';

export const isEmailTestEnv = Meteor.isTest || Meteor.isAppTest;
// export const skipEmails = (Meteor.isDevelopment || Meteor.isStaging) && !isEmailTestEnv;
export const skipEmails = false;

class EmailService {
  sendEmail = ({ emailId, address, name, params }) => {
    const templateOptions = this.createTemplateOptions({
      emailId,
      address,
      name,
      params,
    });
    const template = getMandrillTemplate(templateOptions);
    return sendMandrillTemplate(template).then((response) => {
      this.emailLogger({ emailId, address, template, response });
    });
  };

  sendEmailToUser = ({ emailId, userId, params }) => {
    const { email, name } = UserService.fetchOne({
      $filters: { _id: userId },
      email: 1,
      name: 1,
    });
    this.sendEmail({ emailId, address: email, name, params });
  };

  getEmailConfig = emailId => emailConfigs[emailId];

  createTemplateOptions = ({ emailId, address, name, params }) => {
    const emailConfig = this.getEmailConfig(emailId);
    const {
      template: { mandrillId: templateName },
      createIntlValues,
      ...otherOptions
    } = emailConfig;

    const intlValues = createIntlValues(params);
    const emailContent = getEmailContent(emailId, intlValues);

    // Make sure you call `createOverrides` from emailConfig, to preserve `this`
    // See: https://github.com/Microsoft/vscode/issues/43930
    const overrides = emailConfig.createOverrides(params, emailContent);

    return {
      templateName,
      recipientAddress: address,
      recipientName: name,
      senderAddress: FROM_EMAIL,
      senderName: FROM_NAME,
      subject: emailContent.subject,
      sendAt: undefined,
      ...overrides,
      ...otherOptions,
    };
  };

  getAccountsTemplate = (emailId, params = {}) => {
    const templateOptions = this.createTemplateOptions({ emailId, params });
    return getSimpleMandrillTemplate(templateOptions);
  };

  getEmailPart = (emailId, part) => getEmailPart({ emailId, part });

  renderTemplate = (templateOptions, emailId) => {
    let result;
    this.emailLogger({ emailId, template: templateOptions });

    try {
      result = renderMandrillTemplate(templateOptions);
    } catch (error) {
      throw new Meteor.Error(
        'MANDRILL_ERROR',
        `Error while rendering mandrill template for ${emailId}: ${error.reason
          || error.message
          || error}`,
      );
    }

    return result;
  };

  emailLogger = ({ emailId, address, template, response }) => {
    if (isEmailTestEnv) {
      // Store all sent emails in the DB, to be asserted in tests
      return Meteor.call('storeTestEmail', {
        date: Date.now(),
        emailId,
        address,
        template,
        response,
      });
    }
    if (skipEmails) {
      if (address) {
        console.log(`EmailService dev: Would've sent ${emailId} to ${address} with this template:`);
      } else {
        console.log(`EmailService dev: Would've sent ${emailId} with this template:`);
      }
      console.log(JSON.stringify(template, null, 2));
    }
  };
}

export default new EmailService();
