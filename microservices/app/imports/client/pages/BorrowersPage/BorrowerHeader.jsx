import React from 'react';
import PropTypes from 'prop-types';

import BorrowerAdder from '../../components/BorrowerAdder';
import BorrowerHeaderDetails from './BorrowerHeaderDetails';

const BorrowerHeader = ({ tabId, loan: { _id: loanId, borrowers } }) => (
  <header className="borrower-header borrower-header">
    <div className="borrower-header__row flex">
      {borrowers.map((borrower, borrowerIndex) => (
        <BorrowerHeaderDetails
          key={borrower._id}
          borrower={borrower}
          borrowerCount={borrowers.length}
          tabId={tabId}
          index={borrowerIndex}
        />
      ))}
      {borrowers.length === 1 && (
        <div className="borrower-adder col--50">
          <BorrowerAdder loanId={loanId} />
        </div>
      )}
    </div>
  </header>
);

BorrowerHeader.propTypes = {
  loan: PropTypes.object.isRequired,
  tabId: PropTypes.string.isRequired,
};

export default BorrowerHeader;
