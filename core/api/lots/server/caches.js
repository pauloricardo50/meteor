import Promotions from '../../promotions';
import LotService from './LotService';

LotService.cache(
  {
    collection: Promotions,
    cacheField: 'promotionCache',
    fields: ['_id'],
    type: 'many-inversed',
    referenceField: 'lotLinks:_id',
  },
  { promotionCache: { $exists: false } },
);
