import PromotionLots from '.';

import { Promotions, Properties, Lots, PromotionOptions } from '..';

PromotionLots.addLinks({
  promotions: {
    collection: Promotions,
    inversedBy: 'promotionLots',
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
