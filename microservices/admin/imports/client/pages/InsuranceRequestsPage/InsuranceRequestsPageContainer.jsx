import { withSmartQuery } from 'core/api';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';

export default withSmartQuery({
  query: INSURANCE_REQUESTS_COLLECTION,
  params: {
    $body: {
      name: 1,
      user: { name: 1 },
      status: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
  queryOptions: { reactive: false },
  dataName: 'insuranceRequests',
});
