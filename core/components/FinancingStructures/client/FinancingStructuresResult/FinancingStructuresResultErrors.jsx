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
