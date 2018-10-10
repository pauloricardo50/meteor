import Lots from '.';

import { Promotions, PromotionLots, PromotionOptions } from '..';

Lots.addLinks({
  promotions: {
    collection: Promotions,
    inversedBy: 'lots',
  },
  promotionLot: {
    collection: PromotionLots,
    inversedBy: 'lots',
    unique: true,
    type: 'one',
  },
  promotionOptions: {
    collection: PromotionOptions,
    inversedBy: 'lots',
  },
});
