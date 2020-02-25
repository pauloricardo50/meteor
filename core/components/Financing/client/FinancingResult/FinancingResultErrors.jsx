import Calculator from '../../../../utils/Calculator';
import { getIncomeRatio, getMaxIncomeRatio } from './financingResultHelpers';
import FinanceCalculator from '../FinancingCalculator';

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
  },
  {
    id: 'missingOwnFunds',
    func: ({ loan, structureId }) =>
      Calculator.isMissingOwnFunds({ loan, structureId }),
    type: ERROR_TYPES.WARNING,
  },
  {
    id: 'tooMuchOwnFunds',
    func: ({ loan, structureId }) =>
      Calculator.hasTooMuchOwnFunds({ loan, structureId }),
    type: ERROR_TYPES.WARNING,
  },
  {
    id: 'highIncomeRatio',
    func: data => getIncomeRatio(data) > getMaxIncomeRatio(data),
    type: ERROR_TYPES.WARNING,
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
  },
  {
    id: 'missingCash',
    func: data => {
      const { loan, structureId } = data;
      return !Calculator.hasEnoughCash({ loan, structureId });
    },
    type: ERROR_TYPES.WARNING,
  },
];

export const getFinancingError = props =>
  errors.reduce(
    (currentError, { id, type, func }) =>
      currentError || (func(props) && { id, type }),
    undefined,
  );
