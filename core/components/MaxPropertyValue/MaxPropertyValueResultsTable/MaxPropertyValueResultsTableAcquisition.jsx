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
          <T defaultMessage="Prix d'achat max." />
        </span>
        <Money className="money bold" value={propertyValue} />
        <span className="label">
          <T defaultMessage="Frais de notaire" />
        </span>
        <Money className="money bold" value={notaryFees} />
      </div>
      <div className="right">
        <span className="label">
          <T defaultMessage="Fonds propres" />
        </span>
        <Money className="money bold" value={ownFunds} />
        <span className="label">
          <T defaultMessage="Hypothèque" />
        </span>
        <Money className="money bold" value={loan} />
      </div>
    </div>
    <hr />
    <div className="sums  animated fadeIn">
      <div className="left">
        <span className="label">
          <T defaultMessage="Coût total" />
        </span>
        <Money className="money bold" value={propertyValue + notaryFees} />
      </div>
      <div className="right">
        <span className="label">
          <T defaultMessage="Financement total" />
        </span>
        <Money className="money bold" value={ownFunds + loan} />
      </div>
    </div>
  </>
);

export default MaxPropertyValueResultsTableAcquisition;
