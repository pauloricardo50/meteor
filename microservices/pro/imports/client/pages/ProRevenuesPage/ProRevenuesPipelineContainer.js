import { compose, withState } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proLoansAggregate } from 'core/api/loans/queries';
import { proOrganisation } from 'core/api/organisations/queries';
import { getReferredBy } from 'core/components/ReferredUsersTable/ReferredUsersTableContainer';

const getAnonymous = withAnonymous =>
  withAnonymous ? undefined : { $in: [null, false] };

export default compose(
  withSmartQuery({
    query: proOrganisation,
    params: ({ currentUser }) => {
      const { organisations } = currentUser;
      const { _id: organisationId } = organisations[0];
      return {
        organisationId,
        $body: { commissionRate: 1, users: { name: 1 }, name: 1 },
      };
    },
    queryOptions: { reactive: false, single: true },
    dataName: 'organisation',
  }),
  withState('withAnonymous', 'setWithAnonymous', false),
  withState('referredByUserId', 'setReferredByUserId', true),
  withSmartQuery({
    query: proLoansAggregate,
    params: ({ currentUser, withAnonymous, referredByUserId }) => {
      const { organisations } = currentUser;
      const { _id: organisationId } = organisations[0];
      return {
        anonymous: getAnonymous(withAnonymous),
        referredByUserId: getReferredBy(referredByUserId, organisationId),
        $body: {
          anonymous: 1,
          promotionOptions: {
            value: 1,
            promotionLots: { properties: { totalValue: 1, value: 1 } },
          },
          properties: { totalValue: 1, value: 1 },
          revenues: { amount: 1 },
          selectedStructure: 1,
          status: 1,
          structures: {
            id: 1,
            propertyValue: 1,
            propertyId: 1,
            promotionOptionId: 1,
          },
        },
      };
    },
    dataName: 'loans',
  }),
);
