import { withProps, compose } from 'recompose';
import { withSmartQuery } from 'core/api';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import { ORGANISATION_FEATURES } from 'core/api/constants';
import { lenderInsert, lenderRemove } from 'core/api/methods';

const formatOrganisations = orgs =>
  orgs.reduce(
    (obj, org) => ({ ...obj, [org.type]: [...(obj[org.type] || []), org] }),
    {},
  );

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    params: { features: [ORGANISATION_FEATURES.LENDER] },
    dataName: 'organisations',
  }),
  withProps(({ organisations, loan: { _id: loanId, lenders } }) => ({
    count: organisations.length,
    organisations: formatOrganisations(organisations),
    addLender: organisationId =>
      lenderInsert.run({ lender: { loanId }, organisationId }),
    removeLender: organisationId =>
      lenderRemove.run({
        lenderId: lenders.find(({ organisation }) =>
          organisation && organisation._id === organisationId)._id,
      }),
  })),
);
