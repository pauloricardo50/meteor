import React from 'react';
import PropTypes from 'prop-types';
import Link from 'core/components/Link';

import T from 'core/components/Translation';
import BorrowersSummary from 'core/components/BorrowersSummary';
import LoanSummaryColumns from './LoanSummaryColumns';

const getLoanName = ({ name, customName }) => {
  if (!customName) {
    return name;
  }

  return `${name} - ${customName}`;
};

const LoanSummary = ({ loan }) => {
  const { _id, borrowers, name, customName } = loan;
  const loanName = getLoanName({ name, customName });

  return (
    <Link
      to={`/loans/${_id}`}
      className="card1 card-top card-hover loan-summary"
    >
      <h4>{loanName || <T id="general.loan" />}</h4>

      <LoanSummaryColumns loan={loan} />

      <BorrowersSummary borrowers={borrowers} />
    </Link>
  );
};

LoanSummary.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanSummary;
