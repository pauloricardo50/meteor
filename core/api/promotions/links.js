import Promotions from '.';

import { Properties, Lots, PromotionLots, Users, Loans } from '..';

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
  loans: {
    collection: Loans,
    inversedBy: 'promotions',
  },
  assignedEmployee: {
    collection: Users,
    field: 'assignedEmployeeId',
    type: 'one',
  },
});
