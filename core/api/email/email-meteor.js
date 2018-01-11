import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mandrill } from 'meteor/wylio:mandrill';

import {
  fromEmail,
  defaultFrom,
  emailFooter,
  getEmailContent,
} from './email-defaults';

// Meteor default emails
// https://themeteorchef.com/tutorials/sign-up-with-email-verification
Accounts.emailTemplates.siteName = 'e-Potek';
Accounts.emailTemplates.from = defaultFrom;

Accounts.emailTemplates.verifyEmail = {
  from: () => defaultFrom,
  subject: () => getEmailContent('verifyEmail').subject,
  html(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    let result;

    try {
      result = Mandrill.templates.render({
        template_name: 'welcome',
        template_content: [{ name: 'footer', content: emailFooter(false) }], // no footer
        merge_vars: [{ name: 'VERIFICATION_URL', content: urlWithoutHash }],
        metadata: [{ userId: user._id }],
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(
        'Error while rendering verifyEmail Mandrill template',
        error,
      );
    }
    return result.data.html;
  },
};

Accounts.emailTemplates.resetPassword = {
  from: () => `${getEmailContent('resetPassword').from} <${fromEmail}>`,
  subject: () => getEmailContent('resetPassword').subject,
  html(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    const { title, body, CTA } = getEmailContent('resetPassword');
    let result;

    try {
      // TODO: Make sure this doesn't block
      result = Mandrill.templates.render({
        template_name: 'notification+CTA',
        template_content: [{ name: 'footer', content: emailFooter(false) }], // no footer
        merge_vars: [
          { name: 'title', content: title },
          { name: 'body', content: body },
          { name: 'CTA', content: CTA },
          { name: 'CTA_URL', content: urlWithoutHash },
        ],
        metadata: [{ userId: user._id }],
      });
    } catch (error) {
      throw new Meteor.Error(
        'Error while rendering resetPassword Mandrill template',
        error.reason || error.message || error,
      );
    }
    return result.data.html;
  },
};

Accounts.emailTemplates.enrollAccount = {
  from: () => `${getEmailContent('enrollAccount').from} <${fromEmail}>`,
  subject: () => getEmailContent('enrollAccount').subject,
  html(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    const { title, body, CTA } = getEmailContent('enrollAccount');
    let result;

    try {
      result = Mandrill.templates.render({
        template_name: 'notification+CTA',
        template_content: [{ name: 'footer', content: emailFooter(false) }], // no footer
        merge_vars: [
          { name: 'title', content: title },
          { name: 'body', content: body },
          { name: 'CTA', content: CTA },
          { name: 'CTA_URL', content: urlWithoutHash },
        ],
        metadata: [{ userId: user._id }],
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(
        'Error while rendering enrollAccount Mandrill template',
        error,
      );
    }
    return result.data.html;
  },
};
