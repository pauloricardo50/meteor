// @flow
import Calculator, {
  Calculator as CalculatorClass,
} from 'core/utils/Calculator';
import FinanceCalculator, { getProperty } from '../FinancingCalculator';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../api/constants';

const initCalc = ({
  loan,
  structureId,
  offer,
  Calculator: InitializedCalculator,
}) => {
  let finalOffer = offer;

  if (!finalOffer) {
    const { offers = [] } = loan;
    const { offerId } = Calculator.selectStructure({ loan, structureId });
    finalOffer = offers.find(({ _id }) => offerId === _id);
  }

  if (finalOffer && finalOffer.organisation && finalOffer.organisation.lenderRules) {
    return new CalculatorClass({
      loan,
      structureId,
      lenderRules: finalOffer.organisation.lenderRules,
    });
  }

  return InitializedCalculator;
};
export const getInterests = (params) => {
  const {
    structure: { wantedLoan },
  } = params;
  return (FinanceCalculator.getInterestsWithTranches(params) * wantedLoan) / 12;
};

export const getAmortization = (params) => {
  const calc = initCalc(params);
  const { loan, structureId } = params;

  return calc.getAmortization({ loan, structureId });
};

export const getPropertyExpenses = (data) => {
  const property = getProperty(data);
  return Math.round((property && property.yearlyExpenses) / 12 || 0);
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

export const getBorrowRatio = (params) => {
  const calc = initCalc(params);
  const { loan, structureId } = params;
  return calc.getBorrowRatio({ loan, structureId });
};

export const getIncomeRatio = (params) => {
  console.log('getIncomeRatio params:', params);
  const calc = initCalc(params);
  const { loan, structureId } = params;
  return calc.getIncomeRatio({ loan, structureId });
};

export const getBorrowRatioStatus = (params) => {
  const calc = initCalc(params);
  return calc.getBorrowRatioStatus({ borrowRatio: params.value });
};

export const getIncomeRatioStatus = (params) => {
  const calc = initCalc(params);
  return calc.getIncomeRatioStatus({ incomeRatio: params.value });
};

export const makeHasOwnFundsOfType = type => ({ borrowers }) =>
  Calculator.getFunds({ borrowers, type }) > 0;
