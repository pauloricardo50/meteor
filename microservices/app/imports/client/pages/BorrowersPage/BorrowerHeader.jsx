import React from 'react';
import PropTypes from 'prop-types';

import BorrowerAdder from 'core/components/BorrowerAdder';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

import BorrowerHeaderDetails from './BorrowerHeaderDetails';

const BorrowerHeader = ({
  tabId,
  loan: { _id: loanId, borrowers, user: { _id: userId } = {} },
}) => (
  <header className="borrower-header borrower-header">
    <div className="borrower-header__row flex">
      {borrowers.map((borrower, borrowerIndex) => (
        <BorrowerHeaderDetails
          key={borrower._id}
          borrower={borrower}
          borrowerCount={borrowers.length}
          tabId={tabId}
          index={borrowerIndex}
          loanId={loanId}
        />
      ))}
      {borrowers.length === 1 && (
        <div className="borrower-adder col--50">
          <BorrowerAdder
            loanId={loanId}
            userId={userId}
            TriggerComponent={
              <Button primary label={<T id="BorrowerAdder.label" />} />
            }
          />
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
