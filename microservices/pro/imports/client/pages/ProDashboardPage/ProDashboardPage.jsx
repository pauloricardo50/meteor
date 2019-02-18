// @flow
import React from 'react';

import T from 'core/components/Translation';
import PromotionAdder from './PromotionAdder';
import PropertyAdder from './PropertyAdder';
import ProPromotionsTable from './ProPromotionsTable';
import ProPropertiesTable from './ProPropertiesTable';

type ProDashboardPageProps = {};

const ProDashboardPage = (props: ProDashboardPageProps) => (
  <div className="card1 pro-dashboard-page">
    <h1>
      <T id="ProDashboardPage.title" />
    </h1>
    <div className="buttons">
      <PromotionAdder />
      <PropertyAdder />
    </div>

    <ProPromotionsTable />
    <ProPropertiesTable />
  </div>
);

export default ProDashboardPage;
