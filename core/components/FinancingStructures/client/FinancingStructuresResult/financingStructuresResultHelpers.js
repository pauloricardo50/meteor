// @flow
import { AMORTIZATION_TYPE } from 'core/api/constants';
import Calculator from 'core/utils/Calculator';
import FinanceCalculator, {
  getProperty,
  getAmortizationRateMapper,
} from '../FinancingStructuresCalculator';

export const getInterests = (params) => {
  const {
    structure: { wantedLoan },
  } = params;
  return (FinanceCalculator.getInterestsWithTranches(params) * wantedLoan) / 12;
};

export const getAmortization = (params) => {
  const {
    structure: { wantedLoan },
  } = params;
  return (
    (Calculator.getAmortizationRateBase(getAmortizationRateMapper(params))
      * wantedLoan)
    / 12
  );
};

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

export const getPropertyExpenses = (data) => {
  const property = getProperty(data);
  return (property && property.monthlyExpenses) || 0;
};

export const getRemainingCash = ({ borrowers, structure: { fortuneUsed } }) =>
  Calculator.getFortune({ borrowers }) - fortuneUsed;

export const getRemainingInsurance2 = ({
  borrowers,
  structure: { secondPillarWithdrawal },
}) => Calculator.getInsurance2({ borrowers }) - secondPillarWithdrawal;

export const getRemainingInsurance3A = ({
  borrowers,
  structure: { thirdPillarWithdrawal },
}) => Calculator.getInsurance3A({ borrowers }) - thirdPillarWithdrawal;

export const getRemainingInsurance3B = ({
  borrowers,
  structure: { thirdPillarWithdrawal },
}) => Calculator.getInsurance3B({ borrowers }) - thirdPillarWithdrawal;

export const getRemainingBank3A = ({
  borrowers,
  structure: { thirdPillarWithdrawal },
}) => Calculator.getBank3A({ borrowers }) - thirdPillarWithdrawal;

export const getBorrowRatio = FinanceCalculator.getBorrowRatio;

export const getIncomeRatio = FinanceCalculator.getIncomeRatio;

export const getBorrowRatioStatus = ({ value }) =>
  FinanceCalculator.getBorrowRatioStatus({ borrowRatio: value });
export const getIncomeRatioStatus = ({ value }) =>
  FinanceCalculator.getIncomeRatioStatus({ incomeRatio: value });
