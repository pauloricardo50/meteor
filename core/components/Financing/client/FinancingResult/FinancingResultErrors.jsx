import Calculator from '../../../../utils/Calculator';
import FinanceCalculator from '../FinancingCalculator';
import {
  getBorrowRatio,
  getIncomeRatio,
  getMaxBorrowRatio,
  getMaxIncomeRatio,
  getMaxIncomeRatioTight,
} from './financingResultHelpers';

export const ERROR_TYPES = {
  BREAKING: 'BREAKING',
  WARNING: 'WARNING',
};

const errors = [
  {
    id: 'noMortgageLoan',
    func: ({ loan, structureId }) => {
      const wantedLoan = Calculator.selectStructureKey({
        loan,
        structureId,
        key: 'wantedLoan',
      });
      return !wantedLoan || wantedLoan === 0;
    },
    type: ERROR_TYPES.BREAKING,
    color: 'error',
  },
  {
    id: 'missingOwnFunds',
    func: ({ loan, structureId }) =>
      Calculator.isMissingOwnFunds({ loan, structureId }),
    type: ERROR_TYPES.WARNING,
    color: 'error',
  },
  {
    id: 'tooMuchOwnFunds',
    func: ({ loan, structureId }) =>
      Calculator.hasTooMuchOwnFunds({ loan, structureId }),
    type: ERROR_TYPES.WARNING,
    color: 'warning',
  },
  {
    id: 'missingCash',
    func: data => {
      const { loan, structureId } = data;
      return !Calculator.hasEnoughCash({ loan, structureId });
    },
    type: ERROR_TYPES.WARNING,
    color: 'error',
  },
  {
    id: 'invalidInterestRates',
    func: ({ loan, structureId }) =>
      FinanceCalculator.checkInterestsAndTranches({
        tranches: Calculator.selectStructureKey({
          loan,
          structureId,
          key: 'loanTranches',
        }),
        interestRates: Calculator.selectStructureKey({
          loan,
          structureId,
          key: 'offerId',
        })
          ? Calculator.selectOffer({ loan, structureId })
          : loan.currentInterestRates,
      }),
    type: ERROR_TYPES.BREAKING,
    color: 'error',
  },
  {
    id: 'highBorrowRatio',
    func: data =>
      !Calculator.hasChosenOffer(data) &&
      getBorrowRatio(data) > getMaxBorrowRatio(data),
    type: ERROR_TYPES.WARNING,
    color: 'warning',
  },
  {
    id: 'highBorrowRatioWithLender',
    func: data =>
      Calculator.hasChosenOffer(data) &&
      getBorrowRatio(data) > getMaxBorrowRatio(data),
    type: ERROR_TYPES.WARNING,
    color: 'warning',
  },
  {
    id: 'tightIncomeRatio',
    func: data => {
      const maxIncomeRatioTight = getMaxIncomeRatioTight(data);
      const maxIncomeRatio = getMaxIncomeRatio(data);
      const hasOffer = Calculator.hasChosenOffer(data);

      if (!maxIncomeRatioTight || hasOffer) {
        return false;
      }

      const incomeRatio = getIncomeRatio(data);

      return incomeRatio > maxIncomeRatio && incomeRatio <= maxIncomeRatioTight;
    },
    type: ERROR_TYPES.WARNING,
    color: 'warning',
  },
  {
    id: 'highIncomeRatio',
    func: data =>
      !Calculator.hasChosenOffer(data) &&
      getIncomeRatio(data) > getMaxIncomeRatio(data),
    type: ERROR_TYPES.WARNING,
    color: 'error',
  },
  {
    id: 'highIncomeRatioWithOffer',
    func: data =>
      Calculator.hasChosenOffer(data) &&
      getIncomeRatio(data) > getMaxIncomeRatio(data),
    type: ERROR_TYPES.WARNING,
    color: 'error',
  },
];

export const getFinancingError = props =>
  errors.reduce(
    (currentError, { func, ...rest }) => currentError || (func(props) && rest),
    undefined,
  );
