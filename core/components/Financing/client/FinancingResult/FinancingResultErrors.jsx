// @flow
import React from 'react';
import { compose } from 'recompose';

import T from '../../../Translation';
import Calculator from '../../../../utils/Calculator';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import { getIncomeRatio } from './financingResultHelpers';
import FinancingResultChart from './FinancingResultChart';
import FinanceCalculator from '../FinancingCalculator';

type FinancingResultErrorsProps = {};

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
    func: data => getIncomeRatio(data) > FinanceCalculator.maxIncomeRatio,
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
    func: (data) => {
      const { loan, structureId } = data;
      return !Calculator.hasEnoughCash({ loan, structureId });
    },
    type: ERROR_TYPES.WARNING,
  },
];

const getError = props =>
  errors.reduce(
    (currentError, { id, type, func }) =>
      currentError || (func(props) && { id, type }),
    undefined,
  );

export const FinancingResultErrors = (props: FinancingResultErrorsProps) => {
  const error = getError(props);

  if (error.type === ERROR_TYPES.BREAKING) {
    return (
      <p className="error result">
        <T id={`FinancingResultErrors.${error.id}`} />
      </p>
    );
  }
  if (error.type === ERROR_TYPES.WARNING) {
    return (
      <div className="result">
        <FinancingResultChart {...props} className="" />

        <p className="error error-box">
          <T id={`FinancingResultErrors.${error.id}`} />
        </p>
      </div>
    );
  }

  return <FinancingResultChart {...props} />;
};

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingResultErrors);
