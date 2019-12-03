import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

export const formatPhoneNumber = string => {
  let phoneNumber;

  try {
    phoneNumber = parsePhoneNumberFromString(string, 'CH');
  } catch (error) {
    return string;
  }

  if (!phoneNumber) {
    // Couldn't parse a phone number from the string
    return string;
  }

  const intl = phoneNumber.formatInternational();

  return intl;
};

const modifyDoc = (doc, fieldName, currentValue, customFunc) => {
  if (customFunc) {
    doc[fieldName] = customFunc(currentValue);
  } else if (Array.isArray(currentValue)) {
    doc[fieldName] = currentValue.map(formatPhoneNumber);
  } else {
    doc[fieldName] = formatPhoneNumber(currentValue);
  }
};

const formatNumbersHook = (collection, fieldName, customFunc) => {
  collection.before.update((userId, doc, fieldNames, modifier) => {
    if (fieldNames.includes(fieldName)) {
      const updatedValue = modifier.$set[fieldName];
      modifyDoc(modifier.$set, fieldName, updatedValue, customFunc);
    }
  });

  collection.before.insert((userId, doc) => {
    const insertedValue = doc[fieldName];
    if (insertedValue) {
      modifyDoc(doc, fieldName, insertedValue, customFunc);
    }
  });
};

export default formatNumbersHook;
