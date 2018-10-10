import PromotionLots from '.';

import { Promotions, Properties, Lots, PromotionOptions } from '..';

PromotionLots.addLinks({
  promotion: {
    collection: Promotions,
    inversedBy: 'promotionLots',
    unique: true,
    type: 'one',
  },
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
  promotionOptions: {
    collection: PromotionOptions,
    inversedBy: 'promotionLots',
  },
});
