// @flow
import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import { OrganisationSchema } from 'core/api/organisations/organisations';
import { Uploader } from 'imports/core/components/UploaderArray/index';
import { S3_ACLS } from 'imports/core/api/constants';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import { InsertContactDialogForm } from '../ContactsPage/ContactDialogForm/index';
import ContactsTable from '../ContactsPage/ContactsTable/ContactsTable';
import SingleOrganisationPageContainer from './SingleOrganisationPageContainer';
import OrganisationModifier from './OrganisationModifier';
import OffersTable from './OffersTable/OffersTable';
import Tabs from 'core/components/Tabs';
import T from 'imports/core/components/Translation';

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
  console.log('offers', offers);
  return (
    <div className="card1 card-top">
      <h1>{logo ? <img src={logo} alt={name} /> : name}</h1>
      <div className="flex flex-row space-children">
        <InsertContactDialogForm
          model={{ organisations: [{ _id: organisation._id }] }}
        />
        <OrganisationModifier organisation={organisation} />
      </div>
      <Tabs tabs={tabs({ contacts, offers })} />
      {/* // <h3>Contacts</h3>
      // <ContactsTable contacts={contacts} />
      // <OffersTable offers={offers} /> */}
    </div>
  );
};

export default SingleOrganisationPageContainer(SingleOrganisationPage);
