import { EMAIL_TEMPLATES, EMAIL_IDS } from './emailConstants';
import { getEnrollmentUrl } from './emailHelpers';

const emailConfigs = {};

/**
 * addEmailConfig - A function that creates a config for a given emailId
 *
 * @param {String} emailId A unique id representing the email, from EMAIL_IDS
 * @param {Object} config A config object that can have the following keys:
 * {Object} template A template object from EMAIL_TEMPLATES
 * {Boolean} allowUnsubscribe Defines whether the email will be rendered with
 * a footer that allows the user to unsubscribe to notifications.
 * default is `false`
 * {Function} createOverrides The function that takes the user's values and
 * returns an object with overrides for the email template
 *
 */
const addEmailConfig = (emailId, config) => {
  emailConfigs[emailId] = config;
};

addEmailConfig(EMAIL_IDS.VERIFY_EMAIL, {
  template: EMAIL_TEMPLATES.WELCOME,
  createOverrides({ url }) {
    const { variables } = this.template;
    const urlWithoutHash = url.replace('#/', '');

    return {
      variables: [
        { name: variables.VERIFICATION_URL, content: urlWithoutHash },
      ],
    };
  },
});

addEmailConfig(EMAIL_IDS.RESET_PASSWORD, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ url }, { title, body, cta }) {
    const { variables } = this.template;
    const urlWithoutHash = url.replace('#/', '');

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: urlWithoutHash },
      ],
    };
  },
});

addEmailConfig(EMAIL_IDS.ENROLL_ACCOUNT, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ url, user }, { title, body, cta }) {
    const { variables } = this.template;
    const enrollUrl = getEnrollmentUrl(user, url);

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: enrollUrl },
      ],
    };
  },
});

export default emailConfigs;
