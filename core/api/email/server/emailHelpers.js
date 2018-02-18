import { Meteor } from 'meteor/meteor';
import formatMessage from 'core/utils/intl';

import {
  FROM_DEFAULT,
  CTA_URL_DEFAULT,
  EMAIL_I18N_NAMESPACE,
  EMAIL_PARTS,
} from '../emailConstants';

const WWW_URL = Meteor.settings.public.subdomains.www;
const APP_URL = Meteor.settings.public.subdomains.app;

/**
 * emailFooter - Returns the default email footer for all emails
 *
 * @param {boolean} [unsubscribe=true] Whether to show an unsubscribe line or not
 *
 * @return {type} a HTML string
 */
export const getEmailFooter = (allowUnsubscribe = true) =>
  formatMessage('emails.footer', {
    copyright: '<em>&copy; *|CURRENT_YEAR|* e-Potek</em><br /><br />',
    url: `<a href="${WWW_URL}" target="_blank">e-potek.ch</a><br />`,
    unsubscribe: allowUnsubscribe
      ? `<a href="*|UNSUB|*">${formatMessage('emails.unsubscribe')}</a>`
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
  const subject = getEmailPart({ emailId, part: EMAIL_PARTS.SUBJECT });
  const title = getEmailPart({ emailId, part: EMAIL_PARTS.TITLE });
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

export const getEnrollmentUrl = (user, url) => {
  if (user.roles === 'user' || user.roles.indexOf('user') >= 0) {
    const enrollToken = url.split('/enroll-account/')[1];

    return `${APP_URL}/enroll-account/${enrollToken}`;
  }

  return url;
};
