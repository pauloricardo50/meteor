import {
  EMAIL_TEMPLATES,
  EMAIL_IDS,
  CTA_URL_DEFAULT,
  FOOTER_TYPES,
} from '../emailConstants';
import {
  getEnrollmentUrl,
  notificationTemplateDefaultOverride,
  notificationAndCtaTemplateDefaultOverride,
} from './emailHelpers';

const emailConfigs = {};

const emailDefaults = {
  allowUnsubscribe: false,
  footerType: FOOTER_TYPES.USER,
  createIntlValues: () => ({ variables: [] }),
};

/**
 * addEmailConfig - A function that creates a config for a given emailId
 *
 * @param {String} emailId A unique id representing the email, from EMAIL_IDS
 * @param {Object} config A config object that can have the following keys:
 * {Object} template A template object from EMAIL_TEMPLATES
 * {Boolean} allowUnsubscribe Defines whether the email will be rendered with
 * a footer that allows the user to unsubscribe to notifications.
 * default is `false`
 * {Function} createOverrides A function that gets the params and
 * returns an object with overrides for the email template
 * {Function} createIntlValues A function that gets the params and
 * returns an object with intl values that need to be injected inside of the
 * i18n strings
 */
const addEmailConfig = (emailId, config) => {
  if (config.template === EMAIL_TEMPLATES.NOTIFICATION) {
    emailConfigs[emailId] = {
      createOverrides: notificationTemplateDefaultOverride,
      ...emailDefaults,
      ...config,
    };
  } else if (config.template === EMAIL_TEMPLATES.NOTIFICATION_AND_CTA) {
    emailConfigs[emailId] = {
      createOverrides: notificationAndCtaTemplateDefaultOverride,
      ...emailDefaults,
      ...config,
    };
  } else {
    emailConfigs[emailId] = { ...emailDefaults, ...config };
  }
};

addEmailConfig(EMAIL_IDS.VERIFY_EMAIL, {
  template: EMAIL_TEMPLATES.WELCOME,
  createOverrides({ user, url }) {
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
  createOverrides({ user, url }, { title, body, cta }) {
    const { variables } = this.template;
    const urlWithoutHash = url.replace('#/', '');

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: urlWithoutHash || CTA_URL_DEFAULT },
      ],
    };
  },
});

addEmailConfig(EMAIL_IDS.ENROLL_ACCOUNT, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ user, url }, { title, body, cta }) {
    const { variables } = this.template;
    const enrollUrl = getEnrollmentUrl(user, url);

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: enrollUrl || CTA_URL_DEFAULT },
      ],
    };
  },
});

addEmailConfig(EMAIL_IDS.VERIFICATION_REQUESTED, {
  template: EMAIL_TEMPLATES.NOTIFICATION,
});

addEmailConfig(EMAIL_IDS.VERIFICATION_ERROR, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
});

addEmailConfig(EMAIL_IDS.VERIFICATION_PASSED, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
});

addEmailConfig(EMAIL_IDS.AUCTION_STARTED, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createIntlValues: ({ auctionEndTime }) => ({ date: auctionEndTime }),
});

addEmailConfig(EMAIL_IDS.AUCTION_ENDED, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
});

addEmailConfig(EMAIL_IDS.AUCTION_CANCELLED, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
});

addEmailConfig(EMAIL_IDS.AUCTION_STARTED, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createIntlValues: ({ auctionEndTime }) => ({ date: auctionEndTime }),
});

addEmailConfig(EMAIL_IDS.CONTACT_US, {
  template: EMAIL_TEMPLATES.NOTIFICATION,
  footerType: FOOTER_TYPES.VISITOR,
  createIntlValues: params => params,
});

addEmailConfig(EMAIL_IDS.CONTACT_US_ADMIN, {
  template: EMAIL_TEMPLATES.NOTIFICATION,
  footerType: FOOTER_TYPES.VISITOR,
  createIntlValues: params => params,
});

export default emailConfigs;
