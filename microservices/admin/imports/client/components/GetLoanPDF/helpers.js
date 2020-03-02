import { formatMessage } from 'core/utils/intl';
import { getChecklistMissingInformations } from 'core/components/LoanChecklist/helpers';

export const BACKGROUND_INFO_TYPE = {
  TEMPLATE: 'TEMPLATE',
  CUSTOM: 'CUSTOM',
};

const formatObjectMissingDocuments = ({ title, labels }) =>
  labels.map(({ label }) => `- ${title}: ${label}`).join('\n');

const formatMissingDocuments = loan => {
  const {
    documents: { borrowers = [], property = {} } = {},
  } = getChecklistMissingInformations({ loan }, formatMessage);

  let message = formatMessage({
    id: 'Forms.backgroundInfoTemplate.missingDocuments',
  });

  if (borrowers.length) {
    message = `${message}${borrowers
      .map(formatObjectMissingDocuments)
      .join('\n')}`;
  }

  if (property && property.labels && property.labels.length) {
    message = `${message}\n${formatObjectMissingDocuments(property)}`;
  }

  return message;
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
    additionalInfo = [],
    includeMissingDocuments,
    askForMaxLoan,
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

  if (askForMaxLoan) {
    message = `${message}${formatMessage({
      id: 'Forms.backgroundInfoTemplate.askForMaxLoan',
      values: { singleBorrower },
    })}`;
  }

  if (includeMissingDocuments) {
    message = `${message}\n\n${formatMissingDocuments(loan)}`;
  }

  if (additionalInfo.length) {
    message = `${message}${formatMessage({
      id: 'Forms.backgroundInfoTemplate.additionalInfo',
    })}`;
    message = `${message}${formatAdditionalInfo(additionalInfo)}`;
  }

  message = `${message}${formatMessage({
    id: 'Forms.backgroundInfoTemplate.closing',
    values: { assigneeName },
  })}`;

  return message;
};
