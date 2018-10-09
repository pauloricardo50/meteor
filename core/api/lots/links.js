import Lots from '.';

import { Promotions, PromotionLots } from '..';

Lots.addLinks({
  promotions: {
    collection: Promotions,
    inversedBy: 'lots',
  },
  PromotionLots: {
    collection: PromotionLots,
    inversedBy: 'lots',
  },
});
