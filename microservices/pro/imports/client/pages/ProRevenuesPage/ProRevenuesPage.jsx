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
      <T id="ProRevenuesPage.description" />
    </p>

    <ProRevenuesPipeline {...props} />

    <ProRevenuesTable {...props} />
  </div>
);

export default ProRevenuesPage;
