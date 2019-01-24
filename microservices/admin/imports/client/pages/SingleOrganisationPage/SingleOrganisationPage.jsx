// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import ContactsTable from '../ContactsPage/ContactsTable/ContactsTable';
import SingleOrganisationPageContainer from './SingleOrganisationPageContainer';
import SingleOrganisationPageHeader from './SingleOrganisationPageHeader';
import OffersTable from './OffersTable/OffersTable';
import OrganisationUsersTable from './OrganisationUsersTable/OrganisationUsersTable';

type SingleOrganisationPageProps = {
  organisation: Object,
};

const tabs = props =>
  [
    { id: 'contacts', Component: ContactsTable },
    { id: 'users', Component: OrganisationUsersTable },
    {
      id: 'offers',
      Component: OffersTable,
      condition: props.offers && !!props.offers.length,
    },
  ].map(({ id, Component, condition, style = {} }) => ({
    id,
    content: <Component {...props} />,
    label: (
      <span style={style}>
        <T id={`OrganisationTabs.${id}`} noTooltips />
      </span>
    ),
    condition,
  }));

const SingleOrganisationPage = ({
  organisation,
}: SingleOrganisationPageProps) => {
  const { contacts, offers, users } = organisation;

  return (
    <div className="card1 card-top single-organisation-page">
      <SingleOrganisationPageHeader organisation={organisation} />
      <Tabs
        tabs={tabs({
          contacts,
          users,
          offers,
          organisationId: organisation._id,
        })}
      />
    </div>
  );
};

export default SingleOrganisationPageContainer(SingleOrganisationPage);
