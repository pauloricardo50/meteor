import { OWN_FUNDS_USAGE_TYPES } from 'core/api/constants';
import Calculator from '../../../../utils/Calculator';
import { getProperty } from '../FinancingCalculator';

export const getPropertyValue = data =>
  data.structure.propertyValue || getProperty(data).value;

export const calculateOwnFunds = ({ loan, structureId }) => {
  const ownFunds = Calculator.selectStructureKey({
    loan,
    structureId,
    key: 'ownFunds',
  });

  return ownFunds
    .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value }) => sum + value, 0);
};
export const calculateMaxFortune = ({ borrowers }) =>
  Calculator.getFortune({ borrowers });

export const makeConditionForValue = funcName => ({ borrowers }) =>
  Calculator[funcName]({ borrowers }) > 0;

export const calculateRequiredOwnFunds = (data) => {
  const { propertyWork = 0, wantedLoan } = Calculator.selectStructure(data);
  const propertyValue = Calculator.selectPropertyValue(data);
  const fees = Calculator.getFees(data).total;
  return propertyValue + propertyWork + Math.round(fees) - wantedLoan;
};

export const calculateMissingOwnFunds = (data) => {
  const fundsRequired = calculateRequiredOwnFunds(data);
  const totalCurrentFunds = calculateOwnFunds(data);

  return fundsRequired - totalCurrentFunds;
};
