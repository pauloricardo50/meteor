import React from 'react';

import T, { Money } from '../../Translation';

const MaxPropertyValueResultsTableAcquisition = ({
  propertyValue,
  notaryFees,
  ownFunds,
  loan,
}) => (
  <>
    <div className="balance-sheet animated fadeIn">
      <div className="left">
        <span className="label">
          <T id="MaxPropertyValueResults.maxPropertyValue" />
        </span>
        <Money className="money bold" value={propertyValue} />
        <span className="label">
          <T id="MaxPropertyValueResults.notaryFees" />
        </span>
        <Money className="money bold" value={notaryFees} />
      </div>
      <div className="right">
        <span className="label">
          <T id="MaxPropertyValueResults.ownFunds" />
        </span>
        <Money className="money bold" value={ownFunds} />
        <span className="label">
          <T id="MaxPropertyValueResults.loan" />
        </span>
        <Money className="money bold" value={loan} />
      </div>
    </div>
    <hr />
    <div className="sums  animated fadeIn">
      <div className="left">
        <span className="label">
          <T id="MaxPropertyValueResults.totalCost" />
        </span>
        <Money className="money bold" value={propertyValue + notaryFees} />
      </div>
      <div className="right">
        <span className="label">
          <T id="MaxPropertyValueResults.totalFinancing" />
        </span>
        <Money className="money bold" value={ownFunds + loan} />
      </div>
    </div>
  </>
);

export default MaxPropertyValueResultsTableAcquisition;
