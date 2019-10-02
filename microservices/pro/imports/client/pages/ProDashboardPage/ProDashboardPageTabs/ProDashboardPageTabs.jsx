// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import ProCustomersTable from 'core/components/ProCustomersTable';
import ProPromotionsTable from './ProPromotionsTable';
import ProPropertiesTable from './ProPropertiesTable';
import ProOrganisationPropertiesTable from './ProOrganisationPropertiesTable';

type ProDashboardPageTabsProps = {};

const getTabs = ({ currentUser }) => {
  const { organisations = [] } = currentUser;

  return [
    {
      id: 'loans',
      content: (
        <div>
          <h3 className="text-center">
            <T id="Forms.loans" />
          </h3>
          <ProCustomersTable proUser={currentUser} />
        </div>
      ),
    },
    { id: 'properties', content: <ProPropertiesTable /> },
    {
      id: 'organisationProperties',
      content: <ProOrganisationPropertiesTable />,
    },
    { id: 'promotions', content: <ProPromotionsTable /> },
  ].map(tab => ({
    ...tab,
    label: (
      <T
        id={`ProDashboardPageTabs.${tab.id}`}
        values={{
          orgName: organisations[0] && organisations[0].name,
        }}
      />
    ),
  }));
};

const ProDashboardPageTabs = ({ currentUser }: ProDashboardPageTabsProps) => {
  const tabs = getTabs({ currentUser });
  return <Tabs tabs={tabs} className="pro-dashboard-page-tabs" />;
};

export default ProDashboardPageTabs;
