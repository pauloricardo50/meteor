//      
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import CommissionRatesViewer from 'core/components/CommissionRatesViewer';
import { createRoute } from 'core/utils/routerUtils';
import ReferredUsersTable from 'core/components/ReferredUsersTable';
import PRO_ROUTES from '../../../startup/client/proRoutes';
import ProOrganisationUsersTable from './ProOrganisationUsersTable';

                                     
                       
                      
  

const getTabs = ({ organisation, currentUser }) => {
  const { contacts, commissionRates } = organisation;

  return [
    {
      id: 'users',
      Component: ProOrganisationUsersTable,
    },
    {
      id: 'referredCustomers',
      Component: ReferredUsersTable,
    },
    {
      id: 'commission',
      condition: !!(commissionRates && commissionRates.length > 0),
      Component: CommissionRatesViewer,
    },
  ].map(tab => {
    const { id, Component } = tab;
    return {
      ...tab,
      content: (
        <Component
          {...organisation}
          organisationId={organisation._id}
          currentUser={currentUser}
        />
      ),
      label: <T id={`ProOrganisationPageTabs.${id}`} />,
      to: createRoute(PRO_ROUTES.PRO_ORGANISATION_PAGE.path, { tabId: id }),
    };
  });
};

const ProOrganisationPageTabs = ({
  organisation,
  currentUser,
}                              ) => (
    <Tabs tabs={getTabs({ organisation, currentUser })} routerParamName="tabId" />
  );

export default ProOrganisationPageTabs;
