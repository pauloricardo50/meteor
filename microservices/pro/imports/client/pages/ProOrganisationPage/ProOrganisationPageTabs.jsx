// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import CommissionRatesViewer from 'core/components/CommissionRatesViewer';
import { createRoute } from 'core/utils/routerUtils';
import { PRO_ORGANISATION_PAGE } from '../../../startup/client/proRoutes';
import ProOrganisationUsersTable from './ProOrganisationUsersTable';

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
      content: <Component {...organisation} currentUser={currentUser} />,
      label: <T id={`ProOrganisationPageTabs.${id}`} />,
      to: createRoute(PRO_ORGANISATION_PAGE, { tabId: id }),
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
