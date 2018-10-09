import Lots from '.';

import { Promotions, PromotionLots, PromotionOptions } from '..';

Lots.addLinks({
  promotions: {
    collection: Promotions,
    inversedBy: 'lots',
  },
  promotionLots: {
    collection: PromotionLots,
    inversedBy: 'lots',
  },
  promotionOptions: {
    collection: PromotionOptions,
    inversedBy: 'lotsOverride',
  },
});
