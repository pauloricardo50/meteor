// @flow
import React from 'react';

import T from 'core/components/Translation';
import { ProPropertyAdder } from 'core/components/ProPropertyPage/ProPropertyForm';
import PromotionAdder from './PromotionAdder';
import ProPromotionsTable from './ProPromotionsTable';
import ProPropertiesTable from './ProPropertiesTable';
import ProCustomersTable from 'core/components/ProCustomersTable/ProCustomersTable';
import ProCustomerAdder from 'core/components/ProCustomersTable/ProCustomerAdder';

type ProDashboardPageProps = {};

const ProDashboardPage = (props: ProDashboardPageProps) => (
  <div className="card1 pro-dashboard-page">
    <h1>
      <T id="ProDashboardPage.title" />
    </h1>
    <div className="buttons">
      <PromotionAdder currentUser={props.currentUser} />
      <ProPropertyAdder currentUser={props.currentUser} />
      <ProCustomerAdder currentUser={props.currentUser} />
    </div>
    <ProPromotionsTable />
    <ProPropertiesTable />
    <h3 className="text-center">Dossiers</h3>
    <ProCustomersTable proUser={props.currentUser} />
  </div>
);

export default ProDashboardPage;
