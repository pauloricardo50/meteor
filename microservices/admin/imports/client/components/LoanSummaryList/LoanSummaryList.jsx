import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import LoanSummary from './LoanSummary';
import LoanAdder from './LoanAdder';

const LoanSummaryList = ({ loans, userId }) => {
  if (loans.length > 0) {
    return (
      <React.Fragment>
        <h3>
          <T id="collections.loans" />
          <LoanAdder userId={userId} />
        </h3>
        {loans.map(loan => <LoanSummary loan={loan} key={loan._id} />)}
      </React.Fragment>
    );
  }

  return (
    <h3>
      <T id="LoanSummaryList.noLoans" />
      <LoanAdder userId={userId} />
    </h3>
  );
};

LoanSummaryList.propTypes = {
  loans: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
};

export default LoanSummaryList;
