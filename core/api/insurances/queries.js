import { INSURANCE_QUERIES } from './insuranceConstants';
import Insurances from '.';

export const insuranceSearch = Insurances.createQuery(
  INSURANCE_QUERIES.INSURANCE_SEARCH,
  {
    name: 1,
    status: 1,
    insuranceRequest: { _id: 1 },
    $options: { sort: { createdAt: -1 }, limit: 5 },
  },
);
