// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import ContactsTable from '../ContactsPage/ContactsTable/ContactsTable';
import SingleOrganisationPageContainer from './SingleOrganisationPageContainer';
import OrganisationModifier from './OrganisationModifier';
import OffersTable from './OffersTable/OffersTable';

type SingleOrganisationPageProps = {
  organisation: Object,
};

const tabs = props =>
  [
    { id: 'contacts', Component: ContactsTable },
    { id: 'offers', Component: OffersTable },
  ].map(({ id, Component, style = {} }) => ({
    id,
    content: <Component {...props} />,
    label: (
      <span style={style}>
        <T id={`OrganisationTabs.${id}`} noTooltips />
      </span>
    ),
  }));

const SingleOrganisationPage = ({
  organisation,
}: SingleOrganisationPageProps) => {
  const { contacts, logo, name, offers } = organisation;

  return (
    <div className="card1 card-top">
      <h1 className="single-organisation-header">
        {logo ? <img src={logo} alt={name} /> : name}
        <OrganisationModifier organisation={organisation} />
      </h1>
      <Tabs
        tabs={tabs({
          contacts,
          offers,
          organisationId: organisation._id,
        })}
      />
    </div>
  );
};

export default SingleOrganisationPageContainer(SingleOrganisationPage);
