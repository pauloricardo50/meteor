// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { OrganizationSchema } from 'core/api/organizations/organizations';
import OrganisationsPageContainer from './OrganisationsPageContainer';

type OrganizationsPageProps = {};

const OrganizationsPage = ({ insertOrganization }: OrganizationsPageProps) => (
  <div className="card1 card-top organizations-page">
    <h1>Organisations</h1>
    <AutoFormDialog
      schema={OrganizationSchema}
      buttonProps={{
        label: 'Ajouter Organisation',
        raised: true,
        primary: true,
      }}
      onSubmit={insertOrganization}
    />
  </div>
);

export default OrganisationsPageContainer(OrganizationsPage);
