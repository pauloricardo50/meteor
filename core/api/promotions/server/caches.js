import Loans from '../../loans';
import PromotionService from './PromotionService';

PromotionService.cacheCount(
  {
    collection: Loans,
    referenceField: 'promotionLinks.0._id',
    cacheField: 'loanCount',
  },
  {},
  // { loanCount: { $exists: false } },
);
