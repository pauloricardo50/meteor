import Promotions from '.';

import { Properties, Lots, PromotionLots } from '..';

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
});
