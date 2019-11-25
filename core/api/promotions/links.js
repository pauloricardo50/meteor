import Promotions from '.';

import {
  Properties,
  Lots,
  PromotionLots,
  Users,
  Loans,
  Organisations,
  PromotionOptions,
} from '..';
import Tasks from '../tasks';

import LinkInitializer from '../links/LinkInitializer';

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
