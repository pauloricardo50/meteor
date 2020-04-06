import React from 'react';
import { Helmet } from 'react-helmet';

import { ORGANISATION_FEATURES } from 'core/api/organisations/organisationConstants';
import AdminReferredUsersTable from 'core/components/ReferredUsersTable/AdminReferredUsersTable';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import LenderRulesEditor from '../../components/LenderRulesEditor';
import ContactsTable from '../ContactsPage/ContactsTable/ContactsTable';
import CommissionRates from './CommissionRates';
import InsuranceProducts from './InsuranceProducts';
import OffersTable from './OffersTable/OffersTable';
import OrganisationInfo from './OrganisationInfo';
import OrganisationRevenues from './OrganisationRevenues';
import OrganisationUsersTable from './OrganisationUsersTable/OrganisationUsersTable';
import SingleOrganisationPageContainer from './SingleOrganisationPageContainer';
import SingleOrganisationPageHeader from './SingleOrganisationPageHeader';

const tabs = ({ organisation, currentUser }) =>
  [
    { id: 'info', Component: OrganisationInfo },
    { id: 'users', Component: OrganisationUsersTable },
    { id: 'contacts', Component: ContactsTable },
    {
      id: 'insuranceProducts',
      condition: organisation.features.includes(
        ORGANISATION_FEATURES.INSURANCE,
      ),
      Component: InsuranceProducts,
    },
    {
      id: 'offers',
      Component: OffersTable,
      condition: organisation.offers && !!organisation.offers.length,
    },
    {
      id: 'lenderRules',
      condition: organisation.features.includes(ORGANISATION_FEATURES.LENDER),
      Component: LenderRulesEditor,
    },
    {
      id: 'referredUsers',
      Component: AdminReferredUsersTable,
    },
    {
      id: 'revenues',
      Component: OrganisationRevenues,
      condition:
        organisation.features.includes(ORGANISATION_FEATURES.LENDER) ||
        organisation.features.includes(ORGANISATION_FEATURES.INSURANCE),
    },
    {
      id: 'commission',
      Component: CommissionRates,
      condition: organisation.features.includes(ORGANISATION_FEATURES.PRO),
    },
  ].map(({ id, Component, condition, style = {} }) => ({
    id,
    content: (
      <Component
        {...organisation}
        currentUser={currentUser}
        organisationId={organisation._id}
      />
    ),
    label: (
      <span style={style}>
        <T id={`OrganisationTabs.${id}`} noTooltips />
      </span>
    ),
    condition,
    to: createRoute(ADMIN_ROUTES.SINGLE_ORGANISATION_PAGE.path, {
      organisationId: organisation._id,
      tabId: id,
    }),
  }));

const SingleOrganisationPage = ({ organisation, currentUser }) => (
  <div className="card1 card-top single-organisation-page">
    <Helmet>
      <title>{organisation.name}</title>
    </Helmet>
    <SingleOrganisationPageHeader
      organisation={organisation}
      currentUser={currentUser}
    />
    <Tabs tabs={tabs({ organisation, currentUser })} routerParamName="tabId" />
  </div>
);

export default SingleOrganisationPageContainer(SingleOrganisationPage);
