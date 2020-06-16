import Loans from '../../loans';
import PromotionLots from '../../promotionLots';
import PromotionOptionService from './PromotionOptionService';

PromotionOptionService.cache(
  {
    collection: Loans,
    type: 'many-inverse',
    fields: ['status', 'promotionLinks', 'userCache'],
    referenceField: 'promotionOptionLinks:_id',
    cacheField: 'loanCache',
  },
  { 'loanCache.0.userCache': { $exists: false } },
);

PromotionOptionService.cache(
  {
    collection: PromotionLots,
    type: 'many',
    fields: ['promotionLotGroupIds'],
    referenceField: 'promotionLotLinks:_id',
    cacheField: 'promotionLotCache',
  },
  // { promotionLotCache: { $exists: false } },
);
