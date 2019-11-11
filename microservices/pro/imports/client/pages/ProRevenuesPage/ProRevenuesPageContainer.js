import { compose, withState } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proLoansAggregate } from 'core/api/loans/queries';
import { proOrganisation } from 'core/api/organisations/queries';

const getAnonymous = withAnonymous =>
  withAnonymous ? undefined : { $in: [null, false] };

const getReferredBy = (referredByUserId, organisationId) => {
  if (referredByUserId === true) {
    return;
  }

  if (organisationId === referredByUserId) {
    return 'nobody';
  }

  return referredByUserId;
};

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
      };
    },
    dataName: 'loans',
  }),
);
