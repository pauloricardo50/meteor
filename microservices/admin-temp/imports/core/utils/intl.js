import IntlMessageFormat from 'intl-messageformat';
import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from 'core/lang/fr.json';

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
  const message = new IntlMessageFormat(
    messagesFR[id] || (customFallback !== undefined ? customFallback : id),
    'fr-FR',
    // getFormats(),
  );
  return message.format(values);
};

export default formatMessage;
