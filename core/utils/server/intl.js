import React from 'react';
import { IntlProvider } from 'react-intl';

import messagesFR from '../../lang/fr.json';
import intl from '../intl';
import { getFormats, getUserLocale } from '../localization';

const oldFormatMessage = intl.formatMessage;

intl.formatMessage = (...args) => {
  const [firstArg, ...rest] = args;

  return oldFormatMessage({ ...firstArg, messages: messagesFR }, ...rest);
};

export const ServerIntlProvider = props =>
  React.createElement(IntlProvider, {
    locale: getUserLocale(),
    messages: messagesFR,
    formats: getFormats(),
    defaultLocale: 'fr',
    ...props,
  });
