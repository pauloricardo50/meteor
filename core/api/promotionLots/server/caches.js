import PromotionOptions from '../../promotionOptions';
import Promotions from '../../promotions';
import Properties from '../../properties';
import PromotionLotService from './PromotionLotService';

PromotionLotService.cache(
  {
    cacheField: 'promotionCache',
    collection: Promotions,
    fields: { _id: 1, name: 1 },
    type: 'many-inverse',
    referenceField: 'promotionLotLinks:_id',
  },
  // { promotionCache: { $exists: false } },
);

PromotionLotService.cacheCount(
  {
    collection: PromotionOptions,
    referenceField: 'promotionLotCache.0._id',
    cacheField: 'loanCount',
  },
  // { loanCount: { $exists: false } },
);

PromotionLotService.cache(
  {
    cacheField: 'propertyCache',
    collection: Properties,
    fields: { _id: 1, name: 1 },
    type: 'many',
    referenceField: 'propertyLinks:_id',
  },
  // { propertyCache: { $exists: false } },
);
