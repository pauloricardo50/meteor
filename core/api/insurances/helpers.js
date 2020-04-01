import { INSURANCE_PREMIUM_FREQUENCY } from './insuranceConstants';

export const getFrequency = premiumFrequency => {
  switch (premiumFrequency) {
    case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
      return ' / mois';
    case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
      return ' / trimestre';
    case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
      return ' / semestre';
    case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
      return ' / année';
    case INSURANCE_PREMIUM_FREQUENCY.SINGLE:
      return ' unique';
    default:
      return '';
  }
};

export const getDuration = ({ premiumFrequency, duration }) => {
  switch (premiumFrequency) {
    case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
      return `${duration} mois`;
    case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
      return `${duration} trimestres`;
    case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
      return `${duration} semestres`;
    case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
      return `${duration} ans`;
    default:
      return '';
  }
};
