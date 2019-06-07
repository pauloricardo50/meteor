import { appPromotionOption as appPromotionOptionFragment } from '../fragments';
import { PROMOTION_OPTION_QUERIES } from './promotionOptionConstants';
import PromotionOptions from '.';

export const appPromotionOption = PromotionOptions.createQuery(
  PROMOTION_OPTION_QUERIES.APP_PROMOTION_OPTION,
  {
    $filter({ filters, params: { promotionOptionId } }) {
      filters._id = promotionOptionId;
    },
    ...appPromotionOptionFragment(),
  },
);

export const proPromotionOptions = PromotionOptions.createQuery(
  PROMOTION_OPTION_QUERIES.PRO_PROMOTION_OPTIONS,
  () => {},
);
