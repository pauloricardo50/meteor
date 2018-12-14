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

type SingleOrganisationPageProps = {
  organisation: Object,
};

const SingleOrganisationPage = ({
  organisation,
}: SingleOrganisationPageProps) => {
  const { contacts, logo, name } = organisation;
  return (
    <div className="card1 card-top">
      <h1>{logo ? <img src={logo} alt={name} /> : name}</h1>
      <div className="flex flex-row space-children">
        <InsertContactDialogForm
          model={{ organisations: [{ _id: organisation._id }] }}
        />
        <OrganisationModifier organisation={organisation} />
      </div>
      <h3>Contacts</h3>
      <ContactsTable contacts={contacts} />
    </div>
  );
};

export default SingleOrganisationPageContainer(SingleOrganisationPage);
