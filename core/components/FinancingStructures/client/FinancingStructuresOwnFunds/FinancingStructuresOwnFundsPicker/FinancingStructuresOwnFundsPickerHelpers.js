import { RESIDENCE_TYPE, OWN_FUNDS_TYPES } from '../../../../../api/constants';
import Calculator from '../../../../../utils/Calculator';

export const chooseOwnFundsTypes = ({
  loan: {
    general: { residenceType },
  },
}) =>
  (residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
    ? Object.values(OWN_FUNDS_TYPES)
    : [
      OWN_FUNDS_TYPES.BANK_FORTUNE,
      OWN_FUNDS_TYPES.INSURANCE_3B,
      OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
    ]);

export const shouldAskForUsageType = type =>
  [
    OWN_FUNDS_TYPES.INSURANCE_2,
    OWN_FUNDS_TYPES.INSURANCE_3A,
    OWN_FUNDS_TYPES.INSURANCE_3B,
    OWN_FUNDS_TYPES.BANK_3A,
  ].includes(type);

export const calculateRemainingFunds = ({
  type,
  ownFundsIndex,
  structure,
  borrowers,
}) => {
  const otherOwnFunds = structure.ownFunds.filter((_, index) => index !== ownFundsIndex);
  const ownFundsWithSameType = otherOwnFunds.filter(({ type: otherType }) => otherType === type);
  const usedValue = ownFundsWithSameType.reduce(
    (sum, { value }) => sum + value,
    0,
  );
  const available = Calculator.getFunds({ borrowers, type });

  return available - usedValue;
};
