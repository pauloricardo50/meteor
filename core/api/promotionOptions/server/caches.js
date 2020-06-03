import Loans from '../../loans';
import PromotionLots from '../../promotionLots';
import PromotionOptionService from './PromotionOptionService';

PromotionOptionService.cache(
  {
    collection: Loans,
    type: 'many-inverse',
    fields: ['status', 'promotionLinks'],
    referenceField: 'promotionOptionLinks:_id',
    cacheField: 'loanCache',
  },
  { 'loanCache.promotionLinks': { $exists: false } },
  // { 'loanCache._id': { $exists: false } },
);

PromotionOptionService.cache(
  {
    collection: PromotionLots,
    type: 'many',
    fields: ['promotionLotGroupIds'],
    referenceField: 'promotionLotLinks:_id',
    cacheField: 'promotionLotCache',
  },
  { promotionLotCache: { $exists: false } },
);
