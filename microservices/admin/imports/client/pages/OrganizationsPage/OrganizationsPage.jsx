// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { OrganizationSchema } from 'core/api/organizations/organizations';
import OrganisationsPageContainer from './OrganisationsPageContainer';
import Organization from './Organization';

type OrganizationsPageProps = {};

const OrganizationsPage = ({
  insertOrganization,
  organizations,
}: OrganizationsPageProps) => (
  <div className="card1 card-top organizations-page">
    <h1>Organisations</h1>
    <AutoFormDialog
      schema={OrganizationSchema.omit('logo')}
      buttonProps={{
        label: 'Ajouter Organisation',
        raised: true,
        primary: true,
      }}
      onSubmit={insertOrganization}
    />

    <div className="organizations">
      {organizations
        .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB))
        .map(org => (
          <Organization organization={org} key={org._id} />
        ))}
    </div>
  </div>
);

export default OrganisationsPageContainer(OrganizationsPage);
