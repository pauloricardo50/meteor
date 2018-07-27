// @flow
import { AMORTIZATION_TYPE } from 'core/api/constants';
import BorrowerUtils from 'core/utils/BorrowerUtils';
import FinanceCalculator from '../FinancingStructuresCalculator';

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

export const getRemainingCash = ({ borrowers, structure: { fortuneUsed } }) => BorrowerUtils.getFortune({ borrowers: Object.values(borrowers) })
  - fortuneUsed;

export const getRemainingSecondPillar = ({
  borrowers,
  structure: { secondPillarWithdrawal },
}) => BorrowerUtils.getSecondPillar({ borrowers: Object.values(borrowers) })
  - secondPillarWithdrawal;

export const getRemainingThirdPillar = ({
  borrowers,
  structure: { thirdPillarWithdrawal },
}) => BorrowerUtils.getThirdPillar({ borrowers: Object.values(borrowers) })
  - thirdPillarWithdrawal;
