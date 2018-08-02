// @flow
import { AMORTIZATION_TYPE } from 'core/api/constants';
import Calculator from 'core/utils/Calculator';
import FinanceCalculator from '../FinancingStructuresCalculator';

export const getInterests = params =>
  (FinanceCalculator.getInterestsWithTranches(params)
    * FinanceCalculator.getEffectiveLoan(params))
  / 12;
export const getAmortization = params =>
  (FinanceCalculator.getAmortizationRate(params)
    * FinanceCalculator.getEffectiveLoan(params))
  / 12;
export const getMonthly = params =>
  getInterests(params) + getAmortization(params);

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

export const getRemainingCash = ({ borrowers, structure: { fortuneUsed } }) =>
  Calculator.getFortune({ borrowers }) - fortuneUsed;

export const getRemainingSecondPillar = ({
  borrowers,
  structure: { secondPillarWithdrawal },
}) => Calculator.getSecondPillar({ borrowers }) - secondPillarWithdrawal;

export const getRemainingThirdPillar = ({
  borrowers,
  structure: { thirdPillarWithdrawal },
}) => Calculator.getThirdPillar({ borrowers }) - thirdPillarWithdrawal;
