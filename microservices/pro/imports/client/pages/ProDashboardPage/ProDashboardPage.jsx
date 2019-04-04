// @flow
import React from 'react';

import T from 'core/components/Translation';
import { ProPropertyAdder } from 'core/components/ProPropertyPage/ProPropertyForm';
import ProCustomersTable from 'core/components/ProCustomersTable/ProCustomersTable';
import ProCustomerAdder from 'core/components/ProCustomersTable/ProCustomerAdder';
import PromotionAdder from './PromotionAdder';
import ProPromotionsTable from './ProPromotionsTable';
import ProPropertiesTable from './ProPropertiesTable';
import ProOrganisationPropertiesTable from './ProOrganisationPropertiesTable';

import ExternalPropertyAdder from './ExternalPropertyAdder';

type ProDashboardPageProps = {};

const ProDashboardPage = (props: ProDashboardPageProps) => (
  <div className="card1 pro-dashboard-page">
    <h1>
      <T id="ProDashboardPage.title" />
    </h1>
    <div className="buttons">
      <PromotionAdder currentUser={props.currentUser} />
      <ProPropertyAdder currentUser={props.currentUser} />
      {props.currentUser && props.currentUser.apiPublicKey && (
        <ExternalPropertyAdder />
      )}
      <ProCustomerAdder currentUser={props.currentUser} />
    </div>
    <ProPromotionsTable />
    <ProPropertiesTable />
    <ProOrganisationPropertiesTable />
    <h3 className="text-center">
      <T id="Forms.loans" />
    </h3>
    <ProCustomersTable proUser={props.currentUser} />
  </div>
);

export default ProDashboardPage;
