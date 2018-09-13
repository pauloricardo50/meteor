import {
  RESIDENCE_TYPE,
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
} from '../../../../../api/constants';
import Calculator from '../../../../../utils/Calculator';
import { calculateMaxLoan } from '../../FinancingStructuresFinancing/FinancingStructuresFinancing';
import { getProperty } from '../../FinancingStructuresCalculator';

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

export const getOwnFundsOfTypeAndBorrower = ({
  structure,
  ownFundsIndex = -1,
  type,
  borrowerId,
}) =>
  structure
  && structure.ownFunds
    .filter((_, index) => index !== ownFundsIndex)
    .filter(({ type: otherType, borrowerId: bId }) =>
      otherType === type && bId === borrowerId)
    .reduce((sum, { value }) => sum + value, 0);

export const getAvailableFundsOfTypeAndBorrower = ({
  type,
  borrowerId,
  borrowers,
}) =>
  Calculator.getFunds({
    borrowers: borrowers.find(({ _id }) => _id === borrowerId),
    type,
  });

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
  const usedValue = getOwnFundsOfTypeAndBorrower({
    structure,
    ownFundsIndex,
    type,
    borrowerId,
  });
  const available = getAvailableFundsOfTypeAndBorrower({
    borrowerId,
    type,
    borrowers,
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
  if (shouldDelete || value === 0) {
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

export const getCurrentPledgedFunds = ({ ownFundsIndex, ownFunds }) =>
  ownFunds
    .filter((_, index) => index !== ownFundsIndex)
    .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value }) => sum + value, 0);

export const getNewWantedLoanAfterPledge = (props) => {
  const {
    structure: { wantedLoan, ownFunds },
    usageType,
    value,
    ownFundsIndex,
  } = props;
  if (usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE) {
    return wantedLoan;
  }
  const currentPledgedFunds = getCurrentPledgedFunds({
    ownFunds,
    ownFundsIndex,
  });
  const maxLoanWithNewPledge = calculateMaxLoan(
    props,
    currentPledgedFunds + value,
  );

  return maxLoanWithNewPledge;
};

export const getMaxPledge = (props) => {
  const {
    structure: { propertyWork },
  } = props;
  const propertyValue = getProperty(props).value;

  return Math.round((Calculator.maxBorrowRatioWithPledge - Calculator.maxBorrowRatio)
      * (propertyValue + propertyWork));
};
