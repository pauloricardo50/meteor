import Loans from '../../loans';
import PromotionOptionService from './PromotionOptionService';

PromotionOptionService.cache(
  {
    collection: Loans,
    type: 'many-inverse',
    fields: ['status'],
    referenceField: 'promotionOptionLinks._id',
    cacheField: 'loanCache',
  },
  { loanCache: { $exists: false } },
);
