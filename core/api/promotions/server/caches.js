import Loans from '../../loans';
import PromotionService from './PromotionService';

PromotionService.cacheCount(
  {
    collection: Loans,
    referenceField: 'promotionLinks._id',
    cacheField: 'loanCount',
  },
  { loanCount: { $exists: false } },
);
