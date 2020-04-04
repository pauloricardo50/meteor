import Insurances from '../../insurances';
import InsuranceRequestService from './InsuranceRequestService';

InsuranceRequestService.cache(
  {
    cacheField: 'insurancesCache',
    fields: ['organisationLink'],
    collection: Insurances,
    type: 'many',
    referenceField: 'insuranceLinks:_id',
  },
  // {},
);
