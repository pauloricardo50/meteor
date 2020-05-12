import intl from '../../../utils/intl';

const { formatMessage } = intl;

const formatKey = key => {
  const i18nKey = `Forms.${key}`;
  const translated = formatMessage({
    id: `Forms.${key}`,
    values: { purchaseType: 'ACQUISITION' }, // Do this to avoid purchaseType error
  });

  if (i18nKey === translated) {
    // Translation does not exist
    return key;
  }

  return translated;
};

export const frenchErrors = {
  missingKey: (key, parentKey, orKey, orParentKey) => {
    const firstMessage = parentKey
      ? `Il manque ${formatKey(key)} dans ${formatKey(parentKey)}`
      : `Il manque ${formatKey(key)}`;

    const secondMessage = orKey
      ? orParentKey
        ? ` ou il manque ${formatKey(orKey)} dans ${formatKey(orParentKey)}`
        : ` ou il manque ${formatKey(orKey)}`
      : '';

    return `${firstMessage}${secondMessage}`;
  },
  shouldBeArray: key => `${formatKey(key)} doit être une liste`,
  shouldBeObject: key => `${formatKey(key)} doit être un objet`,
  emptyArray: (key, parentKey) =>
    parentKey
      ? `${formatKey(key)} ne doit pas être vide dans ${formatKey(parentKey)}`
      : `${formatKey(key)} ne doit pas être vide`,
};
