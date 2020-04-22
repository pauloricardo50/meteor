import React from 'react';

import T, { Money } from '../../Translation';

const MaxPropertyValueResultsTableRefinancing = ({ loan, previousLoan }) => {
  const shouldShowOwnFunds = loan > previousLoan;
  return (
    <>
      <div className="balance-sheet animated fadeIn">
        <div className="left">
          <span className="label">
            <T id="MaxPropertyValueResults.maxLoanValue" />
          </span>
          <Money className="money bold" value={loan} />
          <span className="label">
            <T id="MaxPropertyValueResults.previousLoan" />
          </span>
          <Money className="money bold" value={previousLoan} />
        </div>
      </div>
      <hr />
      {shouldShowOwnFunds && (
        <div className="sums  animated fadeIn">
          <div className="left">
            <span className="label">
              <T id="MaxPropertyValueResults.potentialRaise" />
            </span>
            <Money className="money bold" value={loan - previousLoan} />
          </div>
          <div className="right" />
        </div>
      )}
    </>
  );
};

export default MaxPropertyValueResultsTableRefinancing;
