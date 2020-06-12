import React from 'react';
import { withProps } from 'recompose';

import { organisationUpdate } from 'core/api/organisations/methodDefinitions';
import { OrganisationSchema } from 'core/api/organisations/organisations';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import T from 'core/components/Translation';

const schema = OrganisationSchema.omit(
  'contactIds',
  'logo',
  'userLinks',
  'canton',
  'documents',
  'lenderRulesCount',
  'adminNote',
  'mainUserLinks',
  'revenuesCount',
  'insuranceProductLinks',
).extend({
  assigneeLink: { type: Object, optional: true, uniforms: { label: null } },
  'assigneeLink._id': {
    type: String,
    optional: true,
    customAllowedValues: {
      query: USERS_COLLECTION,
      params: {
        $filters: { 'roles._id': ROLES.ADVISOR },
        $options: { sort: { firstName: 1 } },
        firstName: 1,
        office: 1,
      },
    },
    uniforms: {
      transform: ({ firstName }) => firstName,
      label: 'Conseiller par défaut des referrals',
      grouping: {
        groupBy: 'office',
        format: office => <T id={`Forms.office.${office}`} />,
      },
    },
  },
});

export default withProps(({ organisation: { _id: organisationId } }) => ({
  updateOrganisation: object =>
    organisationUpdate.run({ organisationId, object }),
  schema,
}));
