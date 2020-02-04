//      
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import ProCustomersTable from 'core/components/ProCustomersTable';
import collectionIcons from 'core/arrays/collectionIcons';
import ProPromotionsTable from './ProPromotionsTable';
import ProPropertiesTable from './ProPropertiesTable';

                                    

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
    {
      id: 'properties',
      content: <ProPropertiesTable currentUser={currentUser} />,
    },
    { id: 'promotions', content: <ProPromotionsTable /> },
  ].map(tab => ({
    ...tab,
    label: (
      <span className="flex center-align">
        <Icon className="mr-8" type={collectionIcons[tab.id]} size={20} />
        <T
          id={`ProDashboardPageTabs.${tab.id}`}
          values={{
            orgName: organisations[0] && organisations[0].name,
          }}
        />
      </span>
    ),
    to: `/${tab.id}`,
  }));
};

const ProDashboardPageTabs = ({ currentUser }                           ) => {
  const tabs = getTabs({ currentUser });
  return (
    <Tabs
      tabs={tabs}
      className="pro-dashboard-page-tabs"
      routerParamName="tabId"
    />
  );
};

export default ProDashboardPageTabs;
