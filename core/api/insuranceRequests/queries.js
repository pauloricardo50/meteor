import { INSURANCE_REQUEST_QUERIES } from './insuranceRequestConstants';
import InsuranceRequests from '.';

export const insuranceRequestSearch = InsuranceRequests.createQuery(
  INSURANCE_REQUEST_QUERIES.INSURANCE_REQUEST_SEARCH,
  {
    name: 1,
    status: 1,
    $options: { sort: { createdAt: -1 }, limit: 5 },
  },
);
