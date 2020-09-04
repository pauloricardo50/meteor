import { OWN_FUNDS_USAGE_TYPES } from '../../../../api/loans/loanConstants';
import Calculator, {
  Calculator as CalculatorClass,
} from '../../../../utils/Calculator';
import FinanceCalculator from '../FinancingCalculator';

export const initCalc = ({
  loan,
  structureId,
  offer = Calculator.selectOffer({ loan, structureId }),
  Calculator: InitializedCalculator,
}) => {
  if (offer?._id) {
    const lender = Calculator.selectLenderForOfferId({
      loan,
      offerId: offer._id,
    });

    return new CalculatorClass({
      loan,
      structureId,
      lenderRules: lender.organisation.lenderRules,
    });
  }

  // Always reinitialize the calculator
  return new CalculatorClass({
    loan,
    structureId,
    lenderRules: InitializedCalculator.lenderRules,
  });
};

export const getInterests = params =>
  FinanceCalculator.getInterestsWithTranches(params) / 12;

export const getAmortization = params => {
  const calc = initCalc(params);
  const { loan, structureId } = params;

  return calc.getAmortization({ loan, structureId });
};

export const getPropertyExpenses = data => {
  const property = Calculator.selectProperty(data);
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

export const getMaxBorrowRatio = params => {
  const calc = initCalc(params);
  return calc.maxBorrowRatio;
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

export const getMaxIncomeRatioTight = params => {
  const calc = initCalc(params);
  return calc.maxIncomeRatioTight;
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
