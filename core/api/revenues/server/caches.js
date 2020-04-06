import InsuranceRequests from '../../insuranceRequests';
import Insurances from '../../insurances';
import Loans from '../../loans';
import RevenueService from './RevenueService';

RevenueService.cache(
  {
    cacheField: 'loanCache',
    type: 'many-inverse',
    collection: Loans,
    fields: { _id: 1, name: 1 },
    referenceField: 'revenueLinks',
  },
  // { loanCache: { $exists: false } },
);

RevenueService.cache(
  {
    cacheField: 'insuranceRequestCache',
    type: 'many-inverse',
    collection: InsuranceRequests,
    fields: { _id: 1, name: 1 },
    referenceField: 'revenueLinks:_id',
  },
  // { insuranceRequestCache: { $exists: false } },
);
RevenueService.cache(
  {
    cacheField: 'insuranceCache',
    collection: Insurances,
    type: 'many-inverse',
    fields: { _id: 1, name: 1 },
    referenceField: 'revenueLinks:_id',
  },
  // { insuranceCache: { $exists: false } },
);
