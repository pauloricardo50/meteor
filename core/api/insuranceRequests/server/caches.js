import InsuranceRequestService from './InsuranceRequestService';

InsuranceRequestService.cacheField(
  {
    cacheField: 'insurancesCache',
    fields: ['organisationLink'],
  },
  { insurancesCache: { $exists: false } },
);
