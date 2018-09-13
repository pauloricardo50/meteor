import { OWN_FUNDS_USAGE_TYPES } from 'core/api/constants';
import Calculator from '../../../../utils/Calculator';
import { getProperty } from '../FinancingStructuresCalculator';

export const calculateOwnFunds = ({ structure: { ownFunds = [] } }) =>
  ownFunds
    .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value }) => sum + value, 0);

export const calculateMaxFortune = ({ borrowers }) =>
  Calculator.getFortune({ borrowers });

export const makeConditionForValue = funcName => ({ borrowers }) =>
  Calculator[funcName]({ borrowers }) > 0;

export const calculateRequiredOwnFunds = (data) => {
  const { propertyWork, notaryFees, wantedLoan } = data.structure;
  const propertyValue = getProperty(data).value;
  const fees = Calculator.getFeesBase({
    fees: notaryFees,
    propertyValue,
    propertyWork,
  });
  return propertyValue + propertyWork + fees - wantedLoan;
};

export const calculateMissingOwnFunds = (data) => {
  const fundsRequired = calculateRequiredOwnFunds(data);
  const totalCurrentFunds = calculateOwnFunds(data);

  return fundsRequired - totalCurrentFunds;
};
