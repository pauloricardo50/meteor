import { compose, withProps, withState } from 'recompose';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import SimpleSchema from 'simpl-schema';

import { organisationInsert } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import { SINGLE_ORGANISATION_PAGE } from 'imports/startup/client/adminRoutes';
import { createRoute } from 'imports/core/utils/routerUtils';
import {
  ORGANISATION_FEATURES,
  ORGANISATION_TAGS,
  ORGANISATION_TYPES,
} from 'core/api/constants';

const filtersSchema = new SimpleSchema({
  tags: {
    type: Array,
    defaultValue: [],
    uniforms: { placeholder: 'Tous' },
  },
  'tags.$': { type: String, allowedValues: Object.values(ORGANISATION_TAGS) },
  features: {
    type: Array,
    defaultValue: [],
    uniforms: { placeholder: 'Tous' },
  },
  'features.$': {
    type: String,
    allowedValues: Object.values(ORGANISATION_FEATURES),
  },
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

export default compose(
  withRouter,
  withState('filters', 'setFilters', ({ location }) =>
    queryString.parse(location.search, {arrayFormat: 'bracket'})),
  withProps(({ history }) => ({
    insertOrganisation: organisation =>
      organisationInsert.run({ organisation }).then((organisationId) => {
        history.push(createRoute(SINGLE_ORGANISATION_PAGE, { organisationId }));
      }),
    filtersSchema,
  })),
  withSmartQuery({
    query: adminOrganisations,
    params: ({ filters }) => filters,
    dataName: 'organisations',
    reactive: true,
  }),
);
