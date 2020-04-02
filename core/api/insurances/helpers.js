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

export const getEffectiveDuration = ({
  duration,
  premiumFrequency,
  maxProductionYears,
}) => {
  let durationInYears = 0;
  switch (premiumFrequency) {
    case INSURANCE_PREMIUM_FREQUENCY.SINGLE:
      durationInYears = 1;
      break;
    case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
      durationInYears = duration / 12;
      break;
    case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
      durationInYears = duration / 4;
      break;
    case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
      durationInYears = duration / 2;
      break;
    case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
      durationInYears = duration;
      break;
    default:
      break;
  }

  const effectiveDurationInYears = Math.min(
    durationInYears,
    maxProductionYears,
  );

  switch (premiumFrequency) {
    case INSURANCE_PREMIUM_FREQUENCY.SINGLE:
      return effectiveDurationInYears;
    case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
      return effectiveDurationInYears * 12;
    case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
      return effectiveDurationInYears * 4;
    case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
      return effectiveDurationInYears * 2;
    case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
      return effectiveDurationInYears;
    default:
      return 0;
  }
};
