import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

export const formatPhoneNumber = (string) => {
  const phoneNumber = parsePhoneNumberFromString(string, 'CH');

  if (!phoneNumber) {
    // Couldn't parse a phone number from the string
    return string;
  }

  const intl = phoneNumber.formatInternational();

  return intl;
};

const formatNumbersHook = (collection, fieldName, customFunc) => {
  collection.before.update((userId, doc, fieldNames, modifier) => {
    if (fieldNames.includes(fieldName)) {
      const updatedValue = modifier.$set[fieldName];

      if (customFunc) {
        customFunc({ modifier });
      } else if (Array.isArray(updatedValue)) {
        modifier.$set[fieldName] = modifier.$set[fieldName].map(formatPhoneNumber);
      } else {
        modifier.$set[fieldName] = formatPhoneNumber(updatedValue);
      }
    }
  });
};

export default formatNumbersHook;
