// @flow
import Calculator, {
  Calculator as CalculatorClass,
} from 'core/utils/Calculator';
import FinanceCalculator, {
  getOffer,
  getProperty,
  getAmortizationRateMapper,
} from '../FinancingCalculator';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../api/constants';

export const getInterests = (params) => {
  const {
    structure: { wantedLoan },
  } = params;
  return (FinanceCalculator.getInterestsWithTranches(params) * wantedLoan) / 12;
};

export const getAmortization = (params) => {
  const {
    structure: { wantedLoan, offerId },
    offer,
  } = params;

  if (offerId || offer) {
    const { amortizationGoal, amortizationYears } = offer || getOffer(params);
    const calc = new CalculatorClass({ amortizationGoal });
    return (
      (calc.getAmortizationRateBase({
        ...getAmortizationRateMapper(params),
        amortizationYears,
      })
        * wantedLoan)
      / 12
    );
  }

  return (
    (Calculator.getAmortizationRateBase(getAmortizationRateMapper(params))
      * wantedLoan)
    / 12
  );
};

export const getPropertyExpenses = (data) => {
  const property = getProperty(data);
  return (property && property.monthlyExpenses) || 0;
};

const getNonPledgedFundsOfType = ({ structure: { ownFunds }, type }) =>
  ownFunds
    .filter(({ type: t }) => t === type)
    .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value }) => sum + value, 0);

export const getRemainingCash = ({ borrowers, structure }) =>
  Calculator.getFortune({ borrowers })
  - getNonPledgedFundsOfType({ structure, type: 'bankFortune' });

export const getRemainingInsurance2 = ({ borrowers, structure }) =>
  Calculator.getInsurance2({ borrowers })
  - getNonPledgedFundsOfType({ structure, type: 'insurance2' });

export const getRemainingInsurance3A = ({ borrowers, structure }) =>
  Calculator.getInsurance3A({ borrowers })
  - getNonPledgedFundsOfType({ structure, type: 'insurance3A' });

export const getRemainingInsurance3B = ({ borrowers, structure }) =>
  Calculator.getInsurance3B({ borrowers })
  - getNonPledgedFundsOfType({ structure, type: 'insurance3B' });

export const getRemainingBank3A = ({ borrowers, structure }) =>
  Calculator.getBank3A({ borrowers })
  - getNonPledgedFundsOfType({ structure, type: 'bank3A' });

export const getBorrowRatio = FinanceCalculator.getBorrowRatio;

export const getIncomeRatio = FinanceCalculator.getIncomeRatio;

export const getBorrowRatioStatus = ({ value }) =>
  FinanceCalculator.getBorrowRatioStatus({ borrowRatio: value });

export const getIncomeRatioStatus = ({ value }) =>
  FinanceCalculator.getIncomeRatioStatus({ incomeRatio: value });

export const makeHasOwnFundsOfType = type => ({ borrowers }) =>
  Calculator.getFunds({ borrowers, type }) > 0;
