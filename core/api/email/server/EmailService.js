import { Meteor } from 'meteor/meteor';

import ActivityService from '../../activities/server/ActivityService';
import S3Service from '../../files/server/S3Service';
import UserService from '../../users/server/UserService';
import { FROM_EMAIL, FROM_NAME } from '../emailConstants';
import emailConfigs from './emailConfigs';
import { getEmailContent, getEmailPart } from './emailHelpers';
import {
  getMandrillTemplate,
  getSimpleMandrillTemplate,
  renderMandrillTemplate,
  sendMandrillTemplate,
} from './mandrill';

export const isEmailTestEnv = Meteor.isTest || Meteor.isAppTest;
export const skipEmails =
  (Meteor.isDevelopment || Meteor.isDevEnvironment || Meteor.isStaging) &&
  !isEmailTestEnv;
// export const skipEmails = false;

class EmailService {
  sendEmail = async ({ emailId, address, name, params }) => {
    const templateOptions = await this.createTemplateOptions({
      emailId,
      address,
      name,
      params,
    });
    const template = getMandrillTemplate(templateOptions);
    return sendMandrillTemplate(template).then(response => {
      this.emailLogger({ emailId, address, template, response });
      this.addEmailActivity({ address, template, emailId, response });
    });
  };

  sendEmailToUser = ({ emailId, userId, params }) => {
    const { email, name } = UserService.get(userId, { email: 1, name: 1 });
    this.sendEmail({ emailId, address: email, name, params });
  };

  getEmailConfig = emailId => emailConfigs[emailId];

  createTemplateOptions = async ({ emailId, address, name, params = {} }) => {
    const emailConfig = this.getEmailConfig(emailId);
    const {
      template: { mandrillId: templateName },
      createIntlValues,
      ...otherOptions
    } = emailConfig;

    const { attachments = [] } = params;
    let s3Attachments = [];

    if (attachments.length) {
      s3Attachments = await this.getAttachments(attachments);
    }

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
      attachments: s3Attachments.length ? s3Attachments : undefined,
      ...otherOptions,
    };
  };

  getAttachments = attachments =>
    Promise.all(
      attachments.map(async Key => {
        const {
          ContentType,
          ContentDisposition,
          Body,
        } = await S3Service.getObject(Key);

        const name = ContentDisposition
          ? decodeURIComponent(ContentDisposition.match(/filename="(.*)";/m)[1])
          : decodeURIComponent(Key.split('/').slice(-1)[0]);

        return {
          type: ContentType,
          name,
          content: Body.toString('base64'),
        };
      }),
    );

  getAccountsTemplate = async ({ emailId, params = {} }) => {
    const templateOptions = await this.createTemplateOptions({
      emailId,
      params,
    });
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
        `Error while rendering mandrill template for ${emailId}: ${error.reason ||
          error.message ||
          error}`,
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
        console.log(
          `EmailService dev: Would've sent ${emailId} to ${address} with this template:`,
        );
      } else {
        console.log(
          `EmailService dev: Would've sent ${emailId} with this template:`,
        );
      }
      console.log(JSON.stringify(template, null, 2));
    }
  };

  addEmailActivity = ({ address, emailId, template = {}, response }) => {
    const user = UserService.getByEmail(address);

    if (!user) {
      return;
    }

    const { message: { subject, from_email: from } = {} } = template;

    ActivityService.addEmailActivity({
      emailId,
      to: address,
      from,
      response,
      isServerGenerated: true,
      userLink: { _id: user._id },
      title: 'Email envoyé',
      description: `${subject}, de ${from}`,
    });
  };
}

export default new EmailService();
