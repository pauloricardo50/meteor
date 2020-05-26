import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans/loans';
import MortgageNotes from '../mortgageNotes';
import PromotionLots from '../promotionLots';
import Promotions from '../promotions';
import Users from '../users/users';
import Properties from './properties';

LinkInitializer.directInit(() => {
  Properties.addLinks({
    user: {
      field: 'userId',
      collection: Users,
      type: 'one',
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
});

LinkInitializer.inversedInit(() => {
  Properties.addLinks({
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
});
