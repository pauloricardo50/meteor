import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import T from '../../../../Translation';
import {
  getBorrowRatio,
  getBorrowRatioStatus,
} from '../../FinancingResult/financingResultHelpers';
import { FinmaRatio } from '.';

const formatValues = values => {
  if (!values) {
    return;
  }
  const {
    maxBorrowRatio,
    requiredPledgedOwnFunds,
    currentPledgedOwnFunds,
    wantedLoan,
    maxLoan,
  } = values;

  return {
    maxBorrowRatio: maxBorrowRatio * 100,
    requiredPledgedOwnFunds: toMoney(requiredPledgedOwnFunds),
    currentPledgedOwnFunds: toMoney(currentPledgedOwnFunds),
    wantedLoan: toMoney(wantedLoan),
    maxLoan: toMoney(maxLoan),
  };
};

const BorrowRatioStatus = props => {
  const borrowRatio = getBorrowRatio(props);
  const {
    status,
    tooltip: { id, values },
  } = getBorrowRatioStatus(props);

  const formattedValues = formatValues(values);

  return (
    <FinmaRatio
      value={borrowRatio}
      status={status}
      tooltip={<T id={id} values={formattedValues} />}
      {...props}
    />
  );
};

export default BorrowRatioStatus;
