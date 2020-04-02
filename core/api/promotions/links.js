import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans/loans';
import Lots from '../lots/lots';
import Organisations from '../organisations/index';
import PromotionLots from '../promotionLots/index';
import PromotionOptions from '../promotionOptions/index';
import Properties from '../properties/index';
import Tasks from '../tasks';
import Users from '../users/users';
import Promotions from '.';

Promotions.addLinks({
  properties: {
    field: 'propertyLinks',
    collection: Properties,
    type: 'many',
    metadata: true,
    autoremove: true,
    unique: true,
  },
  lots: {
    field: 'lotLinks',
    collection: Lots,
    type: 'many',
    metadata: true,
    autoremove: true,
    unique: true,
  },
  promotionLots: {
    field: 'promotionLotLinks',
    collection: PromotionLots,
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
  assignedEmployee: {
    collection: Users,
    field: 'assignedEmployeeId',
    type: 'one',
  },
  lenderOrganisation: {
    field: 'lenderOrganisationLink',
    type: 'one',
    metadata: true,
    collection: Organisations,
  },
});

LinkInitializer.inversedInit(() => {
  Promotions.addLinks({
    loans: {
      collection: Loans,
      inversedBy: 'promotions',
    },
    tasks: {
      inversedBy: 'promotion',
      collection: Tasks,
      autoremove: true,
    },
    promotionLoan: {
      inversedBy: 'financedPromotion',
      type: 'one',
      collection: Loans,
    },
    promotionOptions: {
      inversedBy: 'promotion',
      type: 'many',
      collection: PromotionOptions,
    },
  });
});
