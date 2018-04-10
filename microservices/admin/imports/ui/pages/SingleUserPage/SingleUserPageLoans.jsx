import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import Loan from './Loan';

const SingleUserPageLoans = ({ user: { loans } }) => {
  if (loans && loans.length > 0) {
    return (
      <div>
        <h3>
          <T id="collections.loans" />
        </h3>
        {loans.map(loan => (
          <Loan
            loan={loan}
            key={loan._id}
            borrowers={loan.borrowers}
            property={loan.property}
          />
        ))}
      </div>
    );
  }

  return null;
};
SingleUserPageLoans.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SingleUserPageLoans;
