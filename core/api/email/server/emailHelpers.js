import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import SecurityService from '../../security';
import Intl, { ServerIntlProvider } from '../../../utils/server/intl';
import ServerEventService from '../../events/server/ServerEventService';
import { ROLES } from '../../constants';
import {
  FROM_DEFAULT,
  CTA_URL_DEFAULT,
  EMAIL_I18N_NAMESPACE,
  EMAIL_PARTS,
} from '../emailConstants';

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
  Intl.formatMessage({
    id: `emails.${footerType}`,
    values: {
      url: `<a href="${WWW_URL}" target="_blank" style="color:inherit;">e-potek.ch</a><br />`,
      unsubscribe: allowUnsubscribe
        ? `<a href="*|UNSUB|*" style="color:inherit;">${Intl.formatMessage({
            id: 'emails.unsubscribe',
          })}</a>`
        : '',
    },
  });

export const getEmailPart = ({
  emailId,
  part,
  intlValues = {},
  intlFallback = '',
}) =>
  Intl.formatMessage({
    id: `${EMAIL_I18N_NAMESPACE}.${emailId}.${part}`,
    values: intlValues,
    fallback: intlFallback,
  });

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
  const userIsAdmin =
    Roles.userIsInRole(user, ROLES.ADMIN) ||
    Roles.userIsInRole(user, ROLES.DEV);
  const token = url.split(`/${path}/`)[1];

  if (userIsUser) {
    return `${APP_URL}/${path}/${token}`;
  }
  if (userIsPro) {
    return `${PRO_URL}/${path}/${token}`;
  }
  if (userIsAdmin) {
    // Admin does not have the enroll, verify, and reset-password pages
    // Just send them to APP
    return `${APP_URL}/${path}/${token}`;
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
  { title, body, cta, ctaUrl = CTA_URL_DEFAULT },
) {
  const { variables } = this.template;

  return {
    variables: [
      { name: variables.TITLE, content: title },
      { name: variables.BODY, content: body },
      { name: variables.CTA, content: cta },
      { name: variables.CTA_URL, content: ctaUrl },
    ],
  };
}

const emailListeners = {};

export const addEmailListener = ({
  method,
  func,
  description = 'no description',
}) => {
  let methodNames = ServerEventService.addAfterMethodListener(method, props => {
    props.context.unblock();
    func(props);
  });

  if (typeof methodNames === 'string') {
    methodNames = [methodNames];
  }

  if (typeof description === 'string') {
    description = [description];
  }

  methodNames.forEach(name => {
    if (emailListeners[name]) {
      emailListeners[name] = [...emailListeners[name], ...description];
    } else {
      emailListeners[name] = [...description];
    }
  });
};

Meteor.methods({
  getEmailListeners() {
    SecurityService.checkUserIsAdmin(this.userId);
    return emailListeners;
  },
});

export const renderEmailComponent = ({ Component, props }) =>
  ReactDOMServer.renderToStaticMarkup(
    <ServerIntlProvider>{Component(props)}</ServerIntlProvider>,
  );
