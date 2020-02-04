import IntlMessageFormat from 'intl-messageformat';
import ReactDOMServer from 'react-dom/server';

import defaultIntlValues from '../components/Translation/defaultIntlValues';
import { getUserLocale } from './localization';

const defaultValues = Object.keys(defaultIntlValues).reduce((obj, key) => {
  const value = defaultIntlValues[key];

  return { ...obj, [key]: ReactDOMServer.renderToString(value) };
}, {});

export class Intl {
  constructor(messages) {
    this.init(messages);
  }

  init(messages) {
    this.messages = messages;
  }

  formatMessage({ id, values = {}, fallback } = {}, legacyValues = {}) {
    const allValues = { ...values, ...legacyValues };
    if (id === undefined) {
      throw new Error('an id is required in formatMessage');
    }

    const message = new IntlMessageFormat(
      this.messages[id] || (fallback !== undefined ? fallback : id),
      getUserLocale(),
    );
    return message.format({ ...defaultValues, ...allValues });
  }
}

const intl = new Intl();
export const formatMessage = intl.formatMessage.bind(intl);
export default intl;
