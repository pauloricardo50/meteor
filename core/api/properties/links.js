import Loans from '../loans/loans';
import MortgageNotes from '../mortgageNotes/index';
import PromotionLots from '../promotionLots/index';
import Promotions from '../promotions/index';
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
