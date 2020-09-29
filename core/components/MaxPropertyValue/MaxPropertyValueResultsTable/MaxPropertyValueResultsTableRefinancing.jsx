import React from 'react';

import T, { Money } from '../../Translation';

const MaxPropertyValueResultsTableRefinancing = ({ loan, previousLoan }) => {
  const shouldShowOwnFunds = loan > previousLoan;
  return (
    <>
      <div className="balance-sheet animated fadeIn">
        <div className="left">
          <span className="label">
            <T defaultMessage="Capacité d'emprunt max." />
          </span>
          <Money className="money bold" value={loan} />
          <span className="label">
            <T defaultMessage="Hypothèque actuelle" />
          </span>
          <Money className="money bold" value={previousLoan} />
        </div>
      </div>
      <hr />
      {shouldShowOwnFunds && (
        <div className="sums  animated fadeIn">
          <div className="left">
            <span className="label">
              <T defaultMessage="Dégagement de liquidités potentiel" />
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
