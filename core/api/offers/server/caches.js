import Lenders from '../../lenders';
import OfferService from './OfferService';

OfferService.cache(
  {
    cacheField: 'lenderCache',
    collection: Lenders,
    fields: {
      loanLink: 1,
    },
    type: 'one',
    referenceField: 'lenderLink._id',
  },
  // { lenderCache: { $exists: false } },
);
