import React from 'react';

import CommissionRatesViewer from 'core/components/CommissionRatesViewer';

import CommissionRatesForm from './CommissionRatesForm';
import EnabledCommissionsForm from './EnabledCommissionsForm';

const CommissionsEditor = props => {
  const {
    commissionRates = {},
    _id: organisationId,
    emptyState,
    enabledCommissions,
  } = props;
  const { rates = [] } = commissionRates;

  return (
    <div>
      <EnabledCommissionsForm
        organisation={{ _id: organisationId, enabledCommissions }}
      />
      <CommissionRatesForm
        commissionRates={commissionRates}
        organisationId={organisationId}
      />
      {rates.length === 0 ? (
        emptyState
      ) : (
        <p className="description">
          Commissions <span className="success">activées</span>
        </p>
      )}
      <hr />
      <CommissionRatesViewer
        organisationId={organisationId}
        commissionRates={commissionRates}
      />
    </div>
  );
};

export default CommissionsEditor;
