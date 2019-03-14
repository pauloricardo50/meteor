// @flow
import React from 'react';

import CommissionRatesViewer from 'core/components/CommissionRatesViewer';
import CommissionRatesForm from './CommissionRatesForm';

const CommissionEditor = ({ commissionRates, _id: organisationId }) => (
  <div>
    <CommissionRatesForm
      commissionRates={commissionRates}
      organisationId={organisationId}
    />
    <hr />
    <CommissionRatesViewer commissionRates={commissionRates} />
  </div>
);

export default CommissionEditor;
