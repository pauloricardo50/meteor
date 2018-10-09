import Properties from './properties';
import { Users, Loans, Promotions, PromotionLots } from '..';

Properties.addLinks({
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
  loans: {
    collection: Loans,
    inversedBy: 'properties',
  },
  promotions: {
    collection: Promotions,
    inversedBy: 'properties',
  },
  promotionLots: {
    collection: PromotionLots,
    inversedBy: 'properties',
  },
});
