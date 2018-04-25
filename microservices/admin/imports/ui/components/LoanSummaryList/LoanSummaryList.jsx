import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import LoanSummary from './LoanSummary';

const LoanSummaryList = ({ loans }) => {
  if (loans && loans.length > 0) {
    return (
      <div>
        <h3>
          <T id="collections.loans" />
        </h3>
        {loans.map(loan => <LoanSummary loan={loan} key={loan._id} />)}
      </div>
    );
  }

  return null;
};

LoanSummaryList.propTypes = {
  loans: PropTypes.array.isRequired,
};

export default LoanSummaryList;
