import React from 'react';

import T from 'core/components/Translation';
import ProRevenuesPipeline from './ProRevenuesPipeline';
import ProRevenuesTable from './ProRevenuesTable';

const ProRevenuesPage = props => (
  <div className="pro-revenues-page card1 card-top">
    <h1>
      <T id="ProRevenuesPage.title" />
    </h1>

    <p className="description">
      Voici les revenus générés par les clients que vous avez référés. Certais
      des chiffres sur cette page incluent des revenus projettés, ou estimés, et
      ne sont donc pas des montants exacts que vous pouvez prévoir.
    </p>

    <ProRevenuesPipeline {...props} />

    <ProRevenuesTable {...props} />
  </div>
);

export default ProRevenuesPage;
