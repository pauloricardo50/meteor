import Promotions from '.';

import { Properties, Lots, PromotionLots, Users, Loans } from '..';

Promotions.addLinks({
  properties: {
    field: 'propertyLinks',
    collection: Properties,
    type: 'many',
    metadata: true,
  },
  lots: {
    field: 'lotLinks',
    collection: Lots,
    type: 'many',
    metadata: true,
  },
  promotionLots: {
    field: 'promotionLotLinks',
    collection: PromotionLots,
    type: 'many',
    metadata: true,
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
});
