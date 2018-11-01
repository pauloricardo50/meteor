import PromotionOptions from '../promotionOptions';
import { PROMOTION_OPTION_QUERIES } from '../promotionOptionConstants';
import { appPromotionOptionFragment } from './promotionOptionFragments';

export default PromotionOptions.createQuery(
  PROMOTION_OPTION_QUERIES.APP_PROMOTION_OPTION,
  {
    $filter({ filters, params: { promotionOptionId } }) {
      filters._id = promotionOptionId;
    },
    ...appPromotionOptionFragment,
  },
);
