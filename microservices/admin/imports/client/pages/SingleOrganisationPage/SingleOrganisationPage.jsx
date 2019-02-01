// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import { ORGANISATION_FEATURES } from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import { SINGLE_ORGANISATION_PAGE } from '../../../startup/client/adminRoutes';
import LenderRulesEditor from '../../components/LenderRulesEditor';
import ContactsTable from '../ContactsPage/ContactsTable/ContactsTable';
import SingleOrganisationPageContainer from './SingleOrganisationPageContainer';
import SingleOrganisationPageHeader from './SingleOrganisationPageHeader';
import OffersTable from './OffersTable/OffersTable';

type SingleOrganisationPageProps = {
  organisation: Object,
};

const tabs = organisation =>
  [
    { id: 'contacts', Component: ContactsTable },
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
  ].map(({ id, Component, condition, style = {} }) => ({
    id,
    content: <Component {...organisation} organisationId={organisation._id} />,
    label: (
      <span style={style}>
        <T id={`OrganisationTabs.${id}`} noTooltips />
      </span>
    ),
    condition,
    to: createRoute(SINGLE_ORGANISATION_PAGE, {
      organisationId: organisation._id,
      tabId: id,
    }),
  }));

const SingleOrganisationPage = ({
  organisation,
}: SingleOrganisationPageProps) => (
  <div className="card1 card-top single-organisation-page">
    <SingleOrganisationPageHeader organisation={organisation} />
    <Tabs tabs={tabs(organisation)} routerParamName="tabId" />
  </div>
);

export default SingleOrganisationPageContainer(SingleOrganisationPage);
