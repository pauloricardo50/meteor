// @flow
import React from 'react';
import { compose } from 'recompose';

import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingStructuresDataContainer from '../containers/FinancingStructuresDataContainer';
import { calculateRequiredOwnFunds } from '../FinancingStructuresOwnFunds/FinancingStructuresOwnFunds';
import { getIncomeRatio } from './financingStructuresResultHelpers';
import FinancingStructuresResultChart from './FinancingStructuresResultChart';
import FinanceCalculator from '../FinancingStructuresCalculator';
import { ROUNDING_AMOUNT } from '../FinancingStructuresOwnFunds/RequiredOwnFunds';

type FinancingStructuresResultErrorsProps = {};

const getCashUsed = ({ structure: { fortuneUsed, thirdPartyFortuneUsed } }) =>
  fortuneUsed + thirdPartyFortuneUsed;

const errors = [
  {
    id: 'noMortgageLoan',
    func: ({ structure: { wantedLoan } }) => !wantedLoan || wantedLoan === 0,
  },
  {
    id: 'missingOwnFunds',
    func: (data) => {
      const requiredFunds = calculateRequiredOwnFunds(data);
      return Number.isNaN(requiredFunds) || requiredFunds >= ROUNDING_AMOUNT;
    },
  },
  {
    id: 'tooMuchOwnFunds',
    func: (data) => {
      const requiredFunds = calculateRequiredOwnFunds(data);
      return Number.isNaN(requiredFunds) || requiredFunds <= -ROUNDING_AMOUNT;
    },
  },
  {
    id: 'highIncomeRatio',
    func: data => getIncomeRatio(data) > FinanceCalculator.maxIncomeRatio,
  },
  {
    id: 'missingCash',
    func: data => FinanceCalculator.getMinCash(data) > getCashUsed(data),
  },
];

const getError = props =>
  errors.reduce(
    (currentError, { id, func }) => currentError || (func(props) && id),
    undefined,
  );

export const FinancingStructuresResultErrors = (props: FinancingStructuresResultErrorsProps) => {
  const error = getError(props);

  return error ? (
    <p className="error result">
      <T id={`FinancingStructuresResultErrors.${error}`} />
    </p>
  ) : (
    <FinancingStructuresResultChart {...props} />
  );
};

export default compose(
  FinancingStructuresDataContainer({ asArrays: true }),
  SingleStructureContainer,
)(FinancingStructuresResultErrors);
