import PromotionOptions from '.';

import { PromotionLots, Lots } from '..';

PromotionOptions.addLinks({
  promotionLots: {
    field: 'promotionLotLinks',
    collection: PromotionLots,
    type: 'many',
    metadata: true,
  },
  lotsOverride: {
    field: 'lotsOverrideLinks',
    collection: Lots,
    type: 'many',
    metadata: true,
  },
});
