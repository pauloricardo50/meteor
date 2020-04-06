import React from 'react';
import { IntlProvider } from 'react-intl';

import messagesFR from '../../lang/fr.json';
import { Intl } from '../intl';
import { getFormats, getUserLocale } from '../localization';

/**
 * formatMessage - A method to use the intl package
 *
 * @param {type}   id          the id of the message
 * @param {object} [values={}] any additional values you want to use in the
 * string
 *
 * @return {type} The formatted string
 */

const ServerIntl = new Intl(messagesFR);
export const formatMessage = ServerIntl.formatMessage.bind(ServerIntl);
export default ServerIntl;

export const ServerIntlProvider = props =>
  React.createElement(IntlProvider, {
    locale: getUserLocale(),
    messages: messagesFR,
    formats: getFormats(),
    defaultLocale: 'fr',
    ...props,
  });
