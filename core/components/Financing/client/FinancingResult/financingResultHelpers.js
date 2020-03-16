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

  if (finalOffer?.organisation?.lenderRules) {
    return new CalculatorClass({
      loan,
      structureId,
      lenderRules: finalOffer.organisation.lenderRules,
    });
  }

  // Always reinitialize the calculator
  return new CalculatorClass({
    loan,
    structureId,
    lenderRules: InitializedCalculator.lenderRules,
  });
};
export const getInterests = params => {
  const {
    structure: { wantedLoan },
  } = params;
  return (FinanceCalculator.getInterestsWithTranches(params) * wantedLoan) / 12;
};

export const getAmortization = params => {
  const calc = initCalc(params);
  const { loan, structureId } = params;

  return calc.getAmortization({ loan, structureId });
};

export const getPropertyExpenses = data => {
  const property = getProperty(data);
  return Math.round((property && property.yearlyExpenses) / 12 || 0);
};

const getNonPledgedFundsOfType = ({
  structure: { ownFunds },
  type,
  borrowerId: bId,
}) =>
  ownFunds
    .filter(({ borrowerId }) => (bId ? bId === borrowerId : true))
    .filter(({ type: t }) => t === type)
    .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value }) => sum + value, 0);

export const getRemainingCash = ({ borrowers, structure }) =>
  borrowers.map(
    b =>
      Calculator.getFortune({ borrowers: b }) -
      getNonPledgedFundsOfType({
        structure,
        type: 'bankFortune',
        borrowerId: b._id,
      }),
  );

export const getRemainingInsurance2 = ({ borrowers, structure }) =>
  borrowers.map(
    b =>
      Calculator.getInsurance2({ borrowers: b }) -
      getNonPledgedFundsOfType({
        structure,
        type: 'insurance2',
        borrowerId: b._id,
      }),
  );

export const getRemainingInsurance3A = ({ borrowers, structure }) =>
  borrowers.map(
    b =>
      Calculator.getInsurance3A({ borrowers: b }) -
      getNonPledgedFundsOfType({
        structure,
        type: 'insurance3A',
        borrowerId: b._id,
      }),
  );

export const getRemainingInsurance3B = ({ borrowers, structure }) =>
  borrowers.map(
    b =>
      Calculator.getInsurance3B({ borrowers: b }) -
      getNonPledgedFundsOfType({
        structure,
        type: 'insurance3B',
        borrowerId: b._id,
      }),
  );

export const getRemainingBank3A = ({ borrowers, structure }) =>
  borrowers.map(
    b =>
      Calculator.getBank3A({ borrowers: b }) -
      getNonPledgedFundsOfType({
        structure,
        type: 'bank3A',
        borrowerId: b._id,
      }),
  );

export const getBorrowRatio = params => {
  const calc = initCalc(params);
  const { loan, structureId } = params;
  return calc.getBorrowRatio({ loan, structureId });
};

export const getIncomeRatio = params => {
  const calc = initCalc(params);
  const { loan, structureId } = params;
  return calc.getIncomeRatio({ loan, structureId });
};

export const getMaxIncomeRatio = params => {
  const calc = initCalc(params);
  return calc.maxIncomeRatio;
};

export const getBorrowRatioStatus = params => {
  const calc = initCalc(params);
  return calc.getBorrowRatioStatus(params);
};

export const getIncomeRatioStatus = params => {
  const calc = initCalc(params);
  return calc.getIncomeRatioStatus({ incomeRatio: params.value });
};

export const makeHasOwnFundsOfType = type => ({ borrowers }) =>
  Calculator.getFunds({ borrowers, type }) > 0;
