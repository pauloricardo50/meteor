import React from 'react';
import SimpleSchema from 'simpl-schema';

import {
  ORGANISATION_TAGS,
  ORGANISATION_TYPES,
} from 'core/api/organisations/organisationConstants';
import AutoForm, { CustomAutoField } from 'core/components/AutoForm2';

const filtersSchema = new SimpleSchema({
  tags: {
    type: Array,
    defaultValue: [],
    uniforms: { placeholder: 'Tous' },
  },
  'tags.$': { type: String, allowedValues: Object.values(ORGANISATION_TAGS) },
  type: {
    type: Array,
    defaultValue: [],
    uniforms: { placeholder: 'Tous' },
  },
  'type.$': {
    type: String,
    allowedValues: Object.values(ORGANISATION_TYPES),
  },
});

const OrganisationFilters = ({ filters, setFilters }) => (
  <AutoForm
    schema={filtersSchema}
    model={filters}
    onSubmit={setFilters}
    autosave
    className="filters-form"
  >
    <div className="filters center">
      <CustomAutoField name="type" />
      <CustomAutoField name="tags" />
    </div>
  </AutoForm>
);

export default OrganisationFilters;
