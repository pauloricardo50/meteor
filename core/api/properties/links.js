import Properties from './properties';
import { Users, Loans, Promotions, PromotionLots, MortgageNotes } from '..';

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
  mortgageNotes: {
    field: 'mortgageNoteLinks',
    collection: MortgageNotes,
    type: 'many',
    metadata: true,
    autoremove: true,
    unique: true,
  },
  users: {
    field: 'userLinks',
    collection: Users,
    type: 'many',
    metadata: true,
  },
});
