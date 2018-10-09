import PromotionLots from '.';

import { Promotions } from '..';

PromotionLots.addLinks({
  promotionLots: {
    collection: Promotions,
    inversedBy: 'promotionLots',
  },
});
