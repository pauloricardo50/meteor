import { compose } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { organisationLoans } from 'core/api/loans/queries';
import proOrganisation from 'core/api/organisations/queries/proOrganisation';

export default compose(
  withSmartQuery({
    query: organisationLoans,
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
  withSmartQuery({
    query: proOrganisation,
    params: ({ currentUser }) => {
      const { organisations } = currentUser;
      const { _id: organisationId } = organisations[0];
      return { organisationId, $body: { commissionRate: 1 } };
    },
    queryOptions: { reactive: false, single: true },
    dataName: 'organisation',
  }),
);
