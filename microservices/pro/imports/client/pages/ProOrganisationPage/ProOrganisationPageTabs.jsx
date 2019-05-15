// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import CommissionRatesViewer from 'core/components/CommissionRatesViewer';
import { createRoute } from 'core/utils/routerUtils';
import PRO_ROUTES from '../../../startup/client/proRoutes';
import ProOrganisationUsersTable from './ProOrganisationUsersTable';
import ReferredCustomersTable from './ReferredCustomersTable';

type ProOrganisationPageTabsProps = {
  organisation: Object,
  currentUser: Object,
};

const getTabs = ({ organisation, currentUser }) => {
  const { contacts, commissionRates } = organisation;

  return [
    {
      id: 'users',
      Component: ProOrganisationUsersTable,
    },
    {
      id: 'referredCustomers',
      Component: ReferredCustomersTable,
    },
    // { id: 'contacts', condition: contacts && contacts.length > 0 },
    {
      id: 'commission',
      condition: !!(commissionRates && commissionRates.length > 0),
      Component: CommissionRatesViewer,
    },
  ].map((tab) => {
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
}: ProOrganisationPageTabsProps) => (
  <Tabs tabs={getTabs({ organisation, currentUser })} routerParamName="tabId" />
);

export default ProOrganisationPageTabs;
