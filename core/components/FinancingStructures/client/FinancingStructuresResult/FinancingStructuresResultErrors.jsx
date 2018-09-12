// @flow
import React from 'react';
import { compose } from 'recompose';

import T from '../../../Translation';
import Calculator from '../../../../utils/Calculator';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingStructuresDataContainer from '../containers/FinancingStructuresDataContainer';
import { calculateMissingOwnFunds } from '../FinancingStructuresOwnFunds/ownFundsHelpers';
import { getIncomeRatio } from './financingStructuresResultHelpers';
import FinancingStructuresResultChart from './FinancingStructuresResultChart';
import FinanceCalculator, {
  getProperty,
} from '../FinancingStructuresCalculator';
import { ROUNDING_AMOUNT } from '../FinancingStructuresOwnFunds/RequiredOwnFunds';
import {
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
} from '../../../../api/constants';

type FinancingStructuresResultErrorsProps = {};

const getCashUsed = ({ structure: { ownFunds } }) =>
  ownFunds
    .filter(({ type, usageType }) =>
      type !== OWN_FUNDS_TYPES.INSURANCE_2
        && usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value }) => sum + value, 0);

const errors = [
  {
    id: 'noMortgageLoan',
    func: ({ structure: { wantedLoan } }) => !wantedLoan || wantedLoan === 0,
  },
  {
    id: 'missingOwnFunds',
    func: (data) => {
      const missingFunds = calculateMissingOwnFunds(data);
      return Number.isNaN(missingFunds) || missingFunds >= ROUNDING_AMOUNT;
    },
  },
  {
    id: 'tooMuchOwnFunds',
    func: (data) => {
      const missingFunds = calculateMissingOwnFunds(data);
      return Number.isNaN(missingFunds) || missingFunds <= -ROUNDING_AMOUNT;
    },
  },
  {
    id: 'highIncomeRatio',
    func: data => getIncomeRatio(data) > FinanceCalculator.maxIncomeRatio,
  },
  {
    id: 'missingCash',
    func: (data) => {
      const { propertyWork, notaryFees } = data.structure;
      const propertyValue = getProperty(data).value;
      return (
        Calculator.getMinCash({
          fees: notaryFees,
          propertyValue,
          propertyWork,
        }) > getCashUsed(data)
      );
    },
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
