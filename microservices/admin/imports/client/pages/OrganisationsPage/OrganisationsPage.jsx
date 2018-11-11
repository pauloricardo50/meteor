// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { OrganisationSchema } from 'core/api/organisations/organisations';
import OrganisationsPageContainer from './OrganisationsPageContainer';
import Organisation from './Organisation';

type OrganisationsPageProps = {};

const OrganisationsPage = ({
  insertOrganisation,
  organisations,
}: OrganisationsPageProps) => (
  <div className="card1 card-top organisations-page">
    <h1>Organisations</h1>
    <AutoFormDialog
      schema={OrganisationSchema.omit('logo')}
      buttonProps={{
        label: 'Ajouter Organisation',
        raised: true,
        primary: true,
      }}
      onSubmit={insertOrganisation}
    />

    <div className="organisations">
      {organisations
        .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB))
        .map(org => (
          <Organisation organisation={org} key={org._id} />
        ))}
    </div>
  </div>
);

export default OrganisationsPageContainer(OrganisationsPage);
