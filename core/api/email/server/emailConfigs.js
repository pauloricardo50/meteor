import ReactDOMServer from 'react-dom/server';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';

import Intl from 'core/utils/server/intl';
import {
  EMAIL_TEMPLATES,
  EMAIL_IDS,
  CTA_URL_DEFAULT,
  FOOTER_TYPES,
  EPOTEK_PHONE,
} from '../emailConstants';
import {
  getAccountsUrl,
  notificationTemplateDefaultOverride,
  notificationAndCtaTemplateDefaultOverride,
} from './emailHelpers';
import PromotionLogos from './components/PromotionLogos';
import LoanChecklistEmail from '../../../components/LoanChecklist/LoanChecklistEmail/LoanChecklistEmail';
import styles from '../../../components/LoanChecklist/LoanChecklistEmail/styles';

const emailConfigs = {};

const emailDefaults = {
  allowUnsubscribe: false,
  footerType: FOOTER_TYPES.USER,
  createIntlValues: params => ({ variables: [], ...params }),
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
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ user, url }, { title, body, cta }) {
    const { variables } = this.template;
    const verifyUrl = getAccountsUrl('verify-email')(user, url);

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: verifyUrl },
      ],
    };
  },
});

addEmailConfig(EMAIL_IDS.RESET_PASSWORD, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ user, url }, { title, body, cta }) {
    const { variables } = this.template;
    const resetPasswordUrl = getAccountsUrl('reset-password')(user, url);

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        {
          name: variables.CTA_URL,
          content: resetPasswordUrl || CTA_URL_DEFAULT,
        },
      ],
    };
  },
});

addEmailConfig(EMAIL_IDS.ENROLL_ACCOUNT, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ user, url }, { title, body, cta }) {
    const { variables } = this.template;
    const enrollUrl = getAccountsUrl('enroll-account')(user, url);

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

const getFirstName = string => string.trim().split(' ')[0];

addEmailConfig(EMAIL_IDS.CONTACT_US, {
  template: EMAIL_TEMPLATES.NOTIFICATION,
  footerType: FOOTER_TYPES.VISITOR,
  createIntlValues: params => ({
    ...params,
    // Only show first names to clients
    name: getFirstName(params.name),
    // params.details check is required because details is optional
    //  and it breaks react-intl if not provided
    details: params.details || '',
  }),
});

addEmailConfig(EMAIL_IDS.CONTACT_US_ADMIN, {
  template: EMAIL_TEMPLATES.NOTIFICATION,
  footerType: FOOTER_TYPES.VISITOR,
  createIntlValues: params => ({
    ...params,
    details: params.details || 'Pas de message',
  }),
});

addEmailConfig(EMAIL_IDS.INVITE_USER_TO_PROMOTION, {
  template: EMAIL_TEMPLATES.PROMOTION_INVITATION,
  createOverrides(
    { coverImageUrl, logoUrls = [], ctaUrl },
    { title, body, cta },
  ) {
    const { variables } = this.template;

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: ctaUrl || CTA_URL_DEFAULT },
        { name: variables.COVER_IMAGE_URL, content: coverImageUrl },
      ],
      senderName: 'e-Potek',
      templateContent: [
        {
          name: 'logos',
          content: ReactDOMServer.renderToStaticMarkup(PromotionLogos({ logoUrls })),
        },
      ],
    };
  },
  createIntlValues: params => ({
    ...params,
    promotionName: params.promotion.name,
    phoneNumber:
      params.promotion.contacts.length
      && params.promotion.contacts[0].phoneNumber,
    name: params.promotion.contacts.length && params.promotion.contacts[0].name,
    epotekNumber: EPOTEK_PHONE,
    assignedEmployeeName:
      (params.promotion.assignedEmployee
        && params.promotion.assignedEmployee.name)
      || 'Yannis Eggert',
    assignedEmployeeFirstName:
      (params.promotion.assignedEmployee
        && params.promotion.assignedEmployee.firstName)
      || 'Yannis',
    assignedEmployeePhone:
      (params.promotion.assignedEmployee
        && params.promotion.assignedEmployee.phoneNumbers[0])
      || EPOTEK_PHONE,
    invitedBy: params.invitedBy || 'e-Potek',
  }),
});

addEmailConfig(EMAIL_IDS.SEND_FEEDBACK_TO_LENDER, {
  template: EMAIL_TEMPLATES.SIMPLE,
  createOverrides(
    {
      assigneeName = 'e-Potek',
      assigneeAddress = 'financements@e-potek.ch',
      feedback,
    },
    { title },
  ) {
    const { variables } = this.template;

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: feedback },
      ],
      senderName: assigneeName,
      senderAddress: assigneeAddress,
      bccAddresses: [{ email: assigneeAddress, name: assigneeName }],
    };
  },
});

// Required params:
// proName
// address
// ctaUrl
addEmailConfig(EMAIL_IDS.INVITE_USER_TO_PROPERTY, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ ctaUrl }, { title, body, cta }) {
    const { variables } = this.template;

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: ctaUrl },
      ],
    };
  },
});

// Required params
// proName
addEmailConfig(EMAIL_IDS.REFER_USER, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ ctaUrl, ...rest }, { title, body, cta, ...rest2 }) {
    const { variables } = this.template;

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: ctaUrl },
      ],
    };
  },
});

addEmailConfig(EMAIL_IDS.FIND_LENDER_NOTIFICATION, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
  createOverrides({ loanId }, { title, body, cta }) {
    const { variables } = this.template;

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: body },
        { name: variables.CTA, content: cta },
        {
          name: variables.CTA_URL,
          content: `${CTA_URL_DEFAULT}/loans/${loanId}/financing`,
        },
      ],
    };
  },
});

addEmailConfig(EMAIL_IDS.CONFIRM_USER_INVITATION, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA,
});

addEmailConfig(EMAIL_IDS.LOAN_CHECKLIST, {
  template: EMAIL_TEMPLATES.NOTIFICATION_AND_CTA_V2,
  createOverrides(
    {
      loan,
      customMessage = '',
      assigneeName = 'e-Potek',
      assigneeAddress = 'info@e-potek.ch',
      bccAddresses = [],
      ...rest
    },
    { title, cta, ...rest2 },
  ) {
    const { variables } = this.template;
    const ctaUrl = `${Meteor.settings.public.subdomains.app}/loans/${loan._id}`;

    return {
      variables: [
        { name: variables.TITLE, content: title },
        { name: variables.BODY, content: customMessage },
        { name: variables.CTA, content: cta },
        { name: variables.CTA_URL, content: ctaUrl },
        { name: variables.CSS, content: styles },
      ],
      templateContent: [
        {
          name: 'body-content-1',
          content: ReactDOMServer.renderToStaticMarkup(LoanChecklistEmail({
            loan,
            intl: { formatMessage: Intl.formatMessage.bind(Intl) },
          })),
        },
      ],
      senderName: assigneeName,
      senderAddress: assigneeAddress,
      bccAddresses: [
        { email: assigneeAddress, name: assigneeName },
        ...bccAddresses.map(email => ({ email })),
      ],
    };
  },
  createIntlValues: params => ({
    ...params,
    today: moment().format('DD MMM YYYY'),
  }),
});

export default emailConfigs;
