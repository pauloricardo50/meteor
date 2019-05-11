import { withProps, compose, withState } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { withSmartQuery } from 'core/api';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import { ORGANISATION_FEATURES, ORGANISATION_TAGS } from 'core/api/constants';
import { lenderInsert, lenderRemove } from 'core/api/methods';
import { lenderRules } from 'core/api/fragments';

const formatOrganisations = orgs =>
  orgs.reduce(
    (obj, org) => ({ ...obj, [org.type]: [...(obj[org.type] || []), org] }),
    {},
  );

const tagPickerSchema = new SimpleSchema({
  tags: {
    type: Array,
    defaultValue: null,
    uniforms: { placeholder: 'Tous' },
  },
  'tags.$': { type: String, allowedValues: Object.values(ORGANISATION_TAGS) },
});

export default compose(
  withState('tags', 'setTags', [ORGANISATION_TAGS.CH_RETAIL]),
  withSmartQuery({
    query: adminOrganisations,
    params: ({ tags }) => ({
      features: [ORGANISATION_FEATURES.LENDER],
      tags,
      $body: { name: 1, logo: 1, type: 1, lenderRules: lenderRules() },
    }),
    dataName: 'organisations',
  }),
  withProps(({ organisations, loan: { _id: loanId, lenders }, setTags }) => ({
    tagPickerSchema,
    filterOrganisations: ({ tags = [] }) => setTags(tags),
    count: organisations.length,
    organisations: formatOrganisations(organisations),
    addLender: organisationId =>
      lenderInsert.run({ lender: { loanId }, organisationId, contactId: null }),
    removeLender: (organisationId) => {
      const lenderToRemove = lenders.find(({ organisation }) =>
        organisation && organisation._id === organisationId);
      const confirmed = window.confirm('Supprimera les offres de ce prêteur aussi, si il y en a.');

      if (confirmed) {
        return lenderRemove.run({ lenderId: lenderToRemove._id });
      }
    },
  })),
);
