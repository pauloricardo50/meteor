// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { OrganisationSchema } from 'core/api/organisations/organisations';
import Icon from 'core/components/Icon/Icon';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import collectionIcons from 'core/arrays/collectionIcons';
import AutoForm, { CustomAutoField } from 'imports/core/components/AutoForm2';
import OrganisationsPageContainer from './OrganisationsPageContainer';
import Organisation from './Organisation';

type OrganisationsPageProps = {
  insertOrganisation: Function,
  organisations: Array<Object>,
  filtersSchema: Object,
  filters: Object,
  setFilters: Function,
};

const OrganisationsPage = ({
  insertOrganisation,
  organisations,
  filtersSchema,
  filters,
  setFilters,
}: OrganisationsPageProps) => (
  <div className="card1 card-top organisations-page">
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[ORGANISATIONS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <span>Organisations</span>
    </h1>
    <AutoFormDialog
      schema={OrganisationSchema.omit(
        'logo',
        'contactIds',
        'canton',
        'userLinks',
      )}
      buttonProps={{
        label: 'Ajouter organisation',
        raised: true,
        primary: true,
      }}
      title="Ajouter organisation"
      onSubmit={insertOrganisation}
    />
    <AutoForm
      schema={filtersSchema}
      model={filters}
      onSubmit={setFilters}
      autosave
      className="filters-form"
    >
      <div className="filters center">
        <CustomAutoField name="type" />
        <CustomAutoField name="features" />
        <CustomAutoField name="tags" />
      </div>
    </AutoForm>

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
