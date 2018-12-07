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
  promotion: {
    collection: Promotions,
    inversedBy: 'properties',
    unique: true,
  },
  promotionLots: {
    collection: PromotionLots,
    inversedBy: 'properties',
  },
});
