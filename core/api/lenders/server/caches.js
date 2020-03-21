import Offers from '../../offers';
import LenderService from './LenderService';

LenderService.cache(
  {
    collection: Offers,
    type: 'inverse',
    fields: ['_id'],
    referenceField: 'lenderLink._id',
    cacheField: 'offersCache',
  },
  {},
);
