import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import formatMessage from 'core/utils/intl';
import {
  FROM_DEFAULT,
  CTA_URL_DEFAULT,
  EMAIL_I18N_NAMESPACE,
  EMAIL_PARTS,
} from '../emailConstants';
import { ROLES } from '../../constants';

const WWW_URL = Meteor.settings.public.subdomains.www;
const APP_URL = Meteor.settings.public.subdomains.app;
const ADMIN_URL = Meteor.settings.public.subdomains.admin;
const PRO_URL = Meteor.settings.public.subdomains.pro;

/**
 * emailFooter - Returns the default email footer for all emails
 *
 * @param {boolean} [unsubscribe=true] Whether to show an unsubscribe line or not
 *
 * @return {type} a HTML string
 */
export const getEmailFooter = (footerType, allowUnsubscribe) =>
  formatMessage(`emails.${footerType}`, {
    url: `<a href="${WWW_URL}" target="_blank" style="color:inherit;">e-potek.ch</a><br />`,
    unsubscribe: allowUnsubscribe
      ? `<a href="*|UNSUB|*" style="color:inherit;">${formatMessage('emails.unsubscribe')}</a>`
      : '',
  });

export const getEmailPart = ({
  emailId,
  part,
  intlValues = {},
  intlFallback = '',
}) =>
  formatMessage(
    `${EMAIL_I18N_NAMESPACE}.${emailId}.${part}`,
    intlValues,
    intlFallback,
  );

/**
 * getEmailContent - Returns all the fields for an email
 *
 * @param {String} emailId an id representing what email this is, example:
 * auctionEnded, verificationRequested
 *
 * @return {Object} contains all the fields
 */
export const getEmailContent = (emailId, intlValues) => {
  const subject = getEmailPart({
    emailId,
    part: EMAIL_PARTS.SUBJECT,
    intlValues,
  });
  const title = getEmailPart({ emailId, part: EMAIL_PARTS.TITLE, intlValues });
  const body = getEmailPart({
    emailId,
    part: EMAIL_PARTS.BODY,
    intlValues: {
      verticalSpace: '<span><br/><br/></span>',
      ...intlValues,
    },
  });
  const cta = getEmailPart({
    emailId,
    part: EMAIL_PARTS.CTA,
    intlValues,
    intlFallback: CTA_URL_DEFAULT,
  });
  const customFrom = getEmailPart({
    emailId,
    part: EMAIL_PARTS.FROM,
    intlValues,
    intlFallback: FROM_DEFAULT,
  });

  return {
    subject,
    title,
    body,
    cta,
    from: customFrom,
  };
};

export const getAccountsUrl = path => (user, url) => {
  const userIsUser = Roles.userIsInRole(user, ROLES.USER);
  const userIsPro = Roles.userIsInRole(user, ROLES.PRO);
  const userIsAdmin = Roles.userIsInRole(user, ROLES.ADMIN)
    || Roles.userIsInRole(user, ROLES.DEV);
  const enrollToken = url.split(`/${path}/`)[1];

  if (userIsUser) {
    return `${APP_URL}/${path}/${enrollToken}`;
  }
  if (userIsPro) {
    return `${PRO_URL}/${path}/${enrollToken}`;
  }
  if (userIsAdmin) {
    return `${ADMIN_URL}/${path}/${enrollToken}`;
  }

  return url;
};

/**
 * This is a default override function for the NOTIFICATION template
 *
 * @export
 * @param {Object} params The params passed by the method
 * @param {Object} { title, body } The strings extracted from i18n files
 * @returns a template override object
 */
export function notificationTemplateDefaultOverride(params, { title, body }) {
  const { variables } = this.template;

  return {
    variables: [
      { name: variables.TITLE, content: title },
      { name: variables.BODY, content: body },
    ],
  };
}

/**
 * This is a default override function for the NOTIFICATION_AND_CTA template
 *
 * @export
 * @param {Object} params The params passed by the method
 * @param {Object} { title, body, cta } The strings extracted from i18n files
 * @returns a template override object
 */
export function notificationAndCtaTemplateDefaultOverride(
  params,
  { title, body, cta },
) {
  const { variables } = this.template;

  return {
    variables: [
      { name: variables.TITLE, content: title },
      { name: variables.BODY, content: body },
      { name: variables.CTA, content: cta },
      { name: variables.CTA_URL, content: CTA_URL_DEFAULT },
    ],
  };
}
