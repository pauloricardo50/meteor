import React from 'react';

import { Money } from '../../Translation';

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
          <span className="label">Capacité d'emprunt max.</span>
          <Money className="money bold" value={loan} />
          <span className="label">Dette actuelle</span>
          <Money className="money bold" value={previousLoan} />
        </div>
        <div className="right">
          <span className="label">Pénalités estimées</span>
          <Money className="money bold" value={reimbursementPenalty} />
        </div>
      </div>
      <hr />
      {shouldShowOwnFunds && (
        <div className="sums  animated fadeIn">
          <div className="left">
            <span className="label">Levée de fonds potentielle</span>
            <Money className="money bold" value={loan - previousLoan} />
          </div>
          <div className="right" />
        </div>
      )}
    </>
  );
};

export default MaxPropertyValueResultsTableRefinancing;
