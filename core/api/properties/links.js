import Loans from '../loans/loans';
import MortgageNotes from '../mortgageNotes';
import PromotionLots from '../promotionLots';
import Promotions from '../promotions';
import Users from '../users/users';
import Properties from './properties';

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
