import React from 'react';

import { ERROR, SUCCESS, WARNING } from 'core/api/constants';
import StatusIcon from 'core/components/StatusIcon';
import T from 'core/components/Translation/FormattedMessage';

import { PURCHASE_TYPE } from './wwwCalculatorConstants';
import {
  getBorrowRatio,
  getFinmaYearlyCost,
  getIncomeRatio,
  getRefinancingBorrowRatio,
  validateBorrowRatio,
  validateIncomeRatio,
} from './wwwCalculatorMath';
import { useWwwCalculator } from './WwwCalculatorState';

const STATUSES = [SUCCESS, WARNING, ERROR];

const getBorrowError = status =>
  status === ERROR
    ? 'WwwCalculatorStatus.borrowError'
    : 'WwwCalculatorStatus.borrowWarning';
const getIncomeError = status =>
  status === ERROR
    ? 'WwwCalculatorStatus.incomeError'
    : 'WwwCalculatorStatus.incomeWarning';

const getMessage = (worstStatus, index, borrowStatus, incomeStatus) => {
  if (worstStatus === SUCCESS) {
    return 'WwwCalculatorStatus.success';
  }
  if (index === 0) {
    return getBorrowError(borrowStatus);
  }
  return getIncomeError(incomeStatus);
};

// Get the worst of the 2 statuses, if one is error and the other warning
// It should return error.
// Spread the array because reverse() changes the array in place
const getWorstStatus = (values, orderedValues) => {
  const match = [...orderedValues]
    .reverse()
    .find(value => values.indexOf(value) >= 0);
  return { match, index: values.indexOf(match) };
};

const hideFinmaValues = (borrowRatio, incomeRatio) =>
  !(borrowRatio && incomeRatio) ||
  Math.abs(borrowRatio) === Infinity ||
  Math.abs(incomeRatio) === Infinity;

const WwwCalculatorStatus = () => {
  const [
    { purchaseType, property, fortune, wantedLoan, salary },
  ] = useWwwCalculator();

  const borrowRatio =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? getBorrowRatio(property.value, fortune.value)
      : getRefinancingBorrowRatio(property.value, wantedLoan.value);
  const incomeRatio = getIncomeRatio(
    salary.value,
    getFinmaYearlyCost(property.value, fortune.value, wantedLoan.value).total,
  );
  const { status: borrowStatus } = validateBorrowRatio(borrowRatio);
  const { status: incomeStatus } = validateIncomeRatio(incomeRatio);

  if (hideFinmaValues(borrowRatio, incomeRatio)) {
    return null;
  }

  const statuses = [borrowStatus, incomeStatus];
  const { match: worstStatus, index } = getWorstStatus(statuses, STATUSES);
  const messageId = getMessage(worstStatus, index, borrowStatus, incomeStatus);

  return (
    <>
      <hr />
      <div className="www-calculator-status animated fadeIn" key={messageId}>
        <StatusIcon status={worstStatus} className="icon" />
        <p className="message">
          <T id={messageId} />
        </p>
      </div>
      <hr />
    </>
  );
};

export default WwwCalculatorStatus;
