import { compose } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proLoansAggregate } from 'core/api/loans/queries';
import { proOrganisation } from 'core/api/organisations/queries';

export default compose(
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
  withSmartQuery({
    query: proLoansAggregate,
    params: ({ currentUser }) => {
      const { organisations } = currentUser;
      const { _id: organisationId } = organisations[0];
      return { organisationId };
    },
    dataName: 'loans',
  }),
);
