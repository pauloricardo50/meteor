import Loans from '../../loans';
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
