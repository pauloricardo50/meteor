import InsuranceRequestService from './InsuranceRequestService';
import Insurances from '../../insurances';

InsuranceRequestService.cache(
  {
    cacheField: 'insurancesCache',
    fields: ['organisationLink'],
    collection: Insurances,
    type: 'many',
    referenceField: 'insuranceLinks:_id',
  },
  {},
  // { insurancesCache: { $exists: false } },
);
