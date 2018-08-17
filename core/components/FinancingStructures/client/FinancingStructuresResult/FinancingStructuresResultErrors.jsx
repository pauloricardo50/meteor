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

type FinancingStructuresResultErrorsProps = {};

const errors = [
  {
    id: 'noMortgageLoan',
    func: ({ structure: { wantedLoan } }) => !wantedLoan || wantedLoan === 0,
  },
  {
    id: 'missingOwnFunds',
    func: (data) => {
      const requiredFunds = calculateRequiredOwnFunds(data);
      return Number.isNaN(requiredFunds) || requiredFunds > 0;
    },
  },
  {
    id: 'tooMuchOwnFunds',
    func: (data) => {
      const requiredFunds = calculateRequiredOwnFunds(data);
      return Number.isNaN(requiredFunds) || requiredFunds < 0;
    },
  },
  {
    id: 'highIncomeRatio',
    func: data => getIncomeRatio(data) > FinanceCalculator.maxIncomeRatio,
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
    <p className="error">
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
