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
  borrowerId,
}) => {
  if (!type) {
    return undefined;
  }
  const otherOwnFunds = structure.ownFunds.filter((_, index) => index !== ownFundsIndex);
  const ownFundsWithSameTypeAndBorrower = otherOwnFunds.filter(({ type: otherType, borrowerId: bId }) =>
    otherType === type && bId === borrowerId);
  const usedValue = ownFundsWithSameTypeAndBorrower.reduce(
    (sum, { value }) => sum + value,
    0,
  );
  const available = Calculator.getFunds({
    borrowers: borrowers.find(({ _id }) => _id === borrowerId),
    type,
  });

  return available - usedValue;
};

export const makeNewOwnFundsArray = ({
  type,
  usageType,
  borrowerId,
  value,
  structure,
  ownFundsIndex,
  shouldDelete,
}) => {
  if (shouldDelete) {
    return [
      ...structure.ownFunds.slice(0, ownFundsIndex),
      ...structure.ownFunds.slice(ownFundsIndex + 1),
    ];
  }

  const newObject = {
    type,
    usageType: shouldAskForUsageType(type) ? usageType : undefined,
    borrowerId,
    value,
  };

  if (ownFundsIndex < 0) {
    return [...structure.ownFunds, newObject];
  }

  return [
    ...structure.ownFunds.slice(0, ownFundsIndex),
    newObject,
    ...structure.ownFunds.slice(ownFundsIndex + 1),
  ];
};
