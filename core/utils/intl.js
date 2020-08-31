import IntlMessageFormat from 'intl-messageformat';
import ReactDOMServer from 'react-dom/server';

import defaultIntlValues from '../components/Translation/defaultIntlValues';
import { getUserLocale } from './localization/localizationHelpers';

const defaultValues = Object.keys(defaultIntlValues).reduce((obj, key) => {
  const value = defaultIntlValues[key];

  return { ...obj, [key]: ReactDOMServer.renderToString(value) };
}, {});

const formatMessage = (
  {
    id,
    values = {},
    fallback,
    messages = global?.window?.intlMessages || {},
  } = {},
  legacyValues = {},
) => {
  const allValues = { ...values, ...legacyValues };
  if (id === undefined) {
    throw new Error('an id is required in formatMessage');
  }

  const message = new IntlMessageFormat(
    messages[id] || (fallback !== undefined ? fallback : id),
    getUserLocale(),
  );

  return message.format({ ...defaultValues, ...allValues });
};

const intl = { formatMessage };
export { formatMessage };

export default intl;
