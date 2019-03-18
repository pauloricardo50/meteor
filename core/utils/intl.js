import IntlMessageFormat from 'intl-messageformat';
import ReactDOMServer from 'react-dom/server';

import {
  getUserLocale,
  getFormats,
} from 'core/utils/localization/localization';
import messagesFR from 'core/lang/fr.json';
import defaultIntlValues from 'core/components/Translation/defaultIntlValues';

const defaultValues = Object.keys(defaultIntlValues).reduce((obj, key) => {
  const value = defaultIntlValues[key];

  return { ...obj, [key]: ReactDOMServer.renderToString(value) };
}, {});

/**
 * formatMessage - A server-side method to use the intl package
 *
 * @param {type}   id          the id of the message
 * @param {object} [values={}] any additional values you want to use in the
 * string
 *
 * @return {type} The formatted string
 */
const formatMessage = (id, values = {}, customFallback) => {
  if (id === undefined) {
    throw new Error('an id is required in formatMessage');
  }

  let intlId;
  if (typeof id === 'object' && !!id.id) {
    intlId = id.id;
  } else {
    intlId = id;
  }

  const message = new IntlMessageFormat(
    messagesFR[intlId]
      || (customFallback !== undefined ? customFallback : intlId),
    getUserLocale(),
    // getFormats(),
  );
  return message.format({ ...defaultValues, ...values });
};

export default formatMessage;
