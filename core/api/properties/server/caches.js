import Loans from '../../loans';
import PropertyService from './PropertyService';

PropertyService.cacheCount(
  {
    collection: Loans,
    referenceField: 'propertyIds',
    cacheField: 'loanCount',
  },
  // { loanCount: { $exists: false } },
);
