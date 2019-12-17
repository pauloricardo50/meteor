import { formatMessage } from 'core/utils/intl';

export const BACKGROUND_INFO_TYPE = {
  TEMPLATE: 'TEMPLATE',
  CUSTOM: 'CUSTOM',
};

const formatAdditionalInfo = additionalInfo =>
  additionalInfo.map(info => `- ${info}`).join('\n');

export const makeGenerateBackgroundInfo = loan => model => {
  const {
    borrowers = [],
    user: { assignedEmployee: { name: assigneeName = 'e-Potek' } = {} } = {},
  } = loan;
  const {
    backgroundInfoType,
    customBackgroundInfo,
    additionalInfo = ['test1', 'test2'],
  } = model;
  const isCustom = backgroundInfoType === BACKGROUND_INFO_TYPE.CUSTOM;

  if (isCustom) {
    return customBackgroundInfo;
  }

  const singleBorrower = borrowers.length === 1;

  let message = formatMessage({
    id: 'Forms.backgroundInfoTemplate.introduction',
    values: { singleBorrower },
  });

  if (additionalInfo.length) {
    message = `${message}${formatMessage({
      id: 'Forms.backgroundInfoTemplate.additionalInfo',
    })}`;
    message = `${message}${formatAdditionalInfo(additionalInfo)}\n`;
  }

  message = `${message}${formatMessage({
    id: 'Forms.backgroundInfoTemplate.closing',
    values: { assigneeName },
  })}`;

  return message;
};
