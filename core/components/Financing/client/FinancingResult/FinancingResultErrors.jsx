// @flow
import React from 'react';
import { compose } from 'recompose';

import T from '../../../Translation';
import Calculator from '../../../../utils/Calculator';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import {
  calculateMissingOwnFunds,
  getPropertyValue,
} from '../FinancingOwnFunds/ownFundsHelpers';
import { getIncomeRatio } from './financingResultHelpers';
import FinancingResultChart from './FinancingResultChart';
import FinanceCalculator, { getOffer } from '../FinancingCalculator';

import { ROUNDING_AMOUNT } from '../FinancingOwnFunds/RequiredOwnFunds';
import {
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
} from '../../../../api/constants';

type FinancingResultErrorsProps = {};

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
    id: 'invalidInterestRates',
    func: data =>
      FinanceCalculator.checkInterestsAndTranches({
        tranches: data.structure.loanTranches,
        interestRates: data.structure.offerId ? getOffer(data) : undefined,
      }),
  },
  {
    id: 'missingCash',
    func: (data) => {
      const { propertyWork, notaryFees } = data.structure;
      const propertyValue = getPropertyValue(data);
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

export const FinancingResultErrors = (props: FinancingResultErrorsProps) => {
  const error = getError(props);

  return error ? (
    <p className="error result">
      <T id={`FinancingResultErrors.${error}`} />
    </p>
  ) : (
    <FinancingResultChart {...props} />
  );
};

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingResultErrors);
