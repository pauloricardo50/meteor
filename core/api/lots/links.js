import PromotionLots from '../promotionLots';
import PromotionOptions from '../promotionOptions';
import Promotions from '../promotions';
import Lots from '.';

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
    inversedBy: 'lots',
  },
});
