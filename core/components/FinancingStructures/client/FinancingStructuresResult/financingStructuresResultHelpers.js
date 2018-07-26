import { AMORTIZATION_TYPE } from 'core/api/constants';
import FinanceCalculator from '../FinancingStructuresCalculator';

export const returnZero = () => 0;
export const getInterests = params => (FinanceCalculator.getInterestsWithTranches(params)
    * FinanceCalculator.getEffectiveLoan(params))
  / 12;
export const getAmortization = params => (FinanceCalculator.getAmortizationRate(params)
    * FinanceCalculator.getEffectiveLoan(params))
  / 12;
export const getMonthly = params => getInterests(params) + getAmortization(params);

export const getAmortizationDeduction = (params) => {
  const {
    structure: { amortizationType },
  } = params;

  if (amortizationType === AMORTIZATION_TYPE.INDIRECT) {
    return FinanceCalculator.getIndirectAmortizationDeduction(params);
  }

  return 0;
};

export const getSecondPillarWithdrawalTax = FinanceCalculator.getSecondPillarWithdrawalTax;

export const getRemainingCash = params => 0;
export const getRemainingSecondPillar = params => 0;
export const getRemainingThirdPillar = params => 0;
