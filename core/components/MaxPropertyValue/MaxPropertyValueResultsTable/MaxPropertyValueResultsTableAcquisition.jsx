import React from 'react';

import { Money } from '../../Translation';

const MaxPropertyValueResultsTableAcquisition = ({
  propertyValue,
  notaryFees,
  ownFunds,
  loan,
}) => (
  <>
    <div className="balance-sheet animated fadeIn">
      <div className="left">
        <span className="label">Prix d'achat max.</span>
        <Money className="money bold" value={propertyValue} />
        <span className="label">Frais de notaire</span>
        <Money className="money bold" value={notaryFees} />
      </div>
      <div className="right">
        <span className="label">Fonds propres</span>
        <Money className="money bold" value={ownFunds} />
        <span className="label">Hypothèque</span>
        <Money className="money bold" value={loan} />
      </div>
    </div>
    <hr />
    <div className="sums  animated fadeIn">
      <div className="left">
        <span className="label">Coût total</span>
        <Money className="money bold" value={propertyValue + notaryFees} />
      </div>
      <div className="right">
        <span className="label">Financement total</span>
        <Money className="money bold" value={ownFunds + loan} />
      </div>
    </div>
  </>
);

export default MaxPropertyValueResultsTableAcquisition;
