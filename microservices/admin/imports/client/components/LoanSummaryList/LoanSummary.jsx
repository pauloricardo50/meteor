import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import T from 'core/components/Translation';
import LoanSummaryColumns from './LoanSummaryColumns';
import BorrowersSummary from '../BorrowersSummary';

const LoanSummary = ({ loan }) => {
  const { _id, borrowers, name } = loan;

  return (
    <div className="mask1 loan-summary">
      <h4>
        <Link to={`/loans/${_id}`}>{name || <T id="general.loan" />}</Link>
      </h4>

      <LoanSummaryColumns loan={loan} />

      <BorrowersSummary borrowers={borrowers} />
    </div>
  );
};

LoanSummary.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanSummary;
