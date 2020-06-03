import PromotionOptions from '../../promotionOptions';
import Promotions from '../../promotions';
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
    referenceField: 'promotionLotCache._id',
    cacheField: 'loanCount',
  },
  { loanCount: { $$exists: false } },
);
