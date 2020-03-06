import { compose, withProps } from 'recompose';
import withMatchParam from 'core/containers/withMatchParam';
import { withSmartQuery } from 'core/api';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';

export default compose(
  withMatchParam('insuranceRequestId'),
  withSmartQuery({
    query: INSURANCE_REQUESTS_COLLECTION,
    params: ({ insuranceRequestId }) => ({
      $filters: { _id: insuranceRequestId },
      name: 1,
      user: { name: 1 },
      status: 1,
    }),
    dataName: 'insuranceRequest',
    queryOptions: { reactive: true, single: true },
  }),
);
