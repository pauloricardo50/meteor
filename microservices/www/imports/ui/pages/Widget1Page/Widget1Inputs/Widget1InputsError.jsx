import React from 'react';
import PropTypes from 'prop-types';

import { SUCCESS, WARNING, ERROR } from 'core/api/constants';
import { T } from 'core/components/Translation';
import StatusIcon from '../../../components/StatusIcon';

const STATUSES = [SUCCESS, WARNING, ERROR];

const getBorrowError = status =>
  (status === ERROR ? 'Borrow warning' : 'Borrow error');
const getIncomeError = status =>
  (status === ERROR ? 'Income warning' : 'Income error');

const getMessage = (worstStatus, index, borrowStatus, incomeStatus) => {
  if (worstStatus === SUCCESS) {
    return <T id="Widget1InputsError.success" />;
  } else if (index === 0) {
    // borrowStatus
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

const Widget1InputsError = ({
  borrowRule: { status: borrowStatus },
  incomeRule: { status: incomeStatus },
}) => {
  const statuses = [borrowStatus, incomeStatus];
  const { match: worstStatus, index } = getWorstStatus(statuses, STATUSES);
  const message = getMessage(worstStatus, index, borrowStatus, incomeStatus);

  return (
    <div className="card-bottom">
      <StatusIcon status={worstStatus} className="icon" />
      <p className="message">{message}</p>
    </div>
  );
};

Widget1InputsError.propTypes = {
  borrowRule: PropTypes.object.isRequired,
  incomeRule: PropTypes.object.isRequired,
};

export default Widget1InputsError;
