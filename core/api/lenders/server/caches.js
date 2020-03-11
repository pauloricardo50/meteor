import Offers from '../../offers';
import LenderService from './LenderService';

LenderService.cache(
  {
    collection: Offers,
    type: 'many-inverse',
    fields: ['_id'],
    referenceField: 'lenderLink._id',
    cacheField: 'offersCache',
  },
  // { offersCache: { $exists: false } },
);
