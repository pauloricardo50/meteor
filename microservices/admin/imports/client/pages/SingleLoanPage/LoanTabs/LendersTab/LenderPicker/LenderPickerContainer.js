import { compose, withProps, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { lenderRules } from 'core/api/fragments';
import { lenderInsert, lenderRemove } from 'core/api/lenders/methodDefinitions';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
  ORGANISATION_TAGS,
} from 'core/api/organisations/organisationConstants';

const formatOrganisations = orgs =>
  orgs.reduce(
    (obj, org) => ({ ...obj, [org.type]: [...(obj[org.type] || []), org] }),
    {},
  );

export default compose(
  withState('tags', 'setTags', [ORGANISATION_TAGS.CH_RETAIL]),
  withState('hasRules', 'setHasRules', true),
  withSmartQuery({
    query: ORGANISATIONS_COLLECTION,
    params: ({ tags, hasRules }) => ({
      $filters: {
        features: [ORGANISATION_FEATURES.LENDER],
        ...(tags?.length ? { tags: { $in: tags } } : {}),
        ...(hasRules ? { lenderRulesCount: { $gte: 1 } } : {}),
      },
      name: 1,
      logo: 1,
      type: 1,
      lenderRules: lenderRules(),
      $options: { sort: { name: 1 } },
    }),
    deps: ({ tags, hasRules }) => [tags, hasRules],
    dataName: 'organisations',
  }),
  withProps(({ organisations, loan: { _id: loanId, lenders }, setTags }) => ({
    filterOrganisations: ({ tags = [] }) => setTags(tags),
    count: organisations.length,
    organisations: formatOrganisations(organisations),
    addLender: organisationId =>
      lenderInsert.run({ lender: { loanId }, organisationId, contactId: null }),
    removeLender: organisationId => {
      const lenderToRemove = lenders.find(
        ({ organisation }) =>
          organisation && organisation._id === organisationId,
      );
      const confirmed = window.confirm(
        'Supprimera les offres de ce prêteur aussi, si il y en a.',
      );

      if (confirmed) {
        return lenderRemove.run({ lenderId: lenderToRemove._id });
      }
    },
  })),
);
