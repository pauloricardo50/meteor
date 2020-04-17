import React from 'react';

import T, { Money } from '../../Translation';

const MaxPropertyValueResultsTableRefinancing = ({
  loan,
  previousLoan,
  reimbursementPenalty,
}) => {
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
        <div className="right">
          <span className="label">
            <T
              id="MaxPropertyValueResults.reimbursementPenalty"
              tooltip={
                <T id="MaxPropertyValueResults.reimbursementPenalty.tooltip" />
              }
            />
          </span>
          <Money className="money bold" value={reimbursementPenalty} />
        </div>
      </div>
      <hr />
      {shouldShowOwnFunds && (
        <div className="sums  animated fadeIn">
          <div className="left">
            <span className="label">
              <T
                id="MaxPropertyValueResults.potentialRaise"
                tooltip={
                  <T id="MaxPropertyValueResults.potentialRaise.tooltip" />
                }
              />
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
