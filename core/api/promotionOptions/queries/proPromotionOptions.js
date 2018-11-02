import PromotionOptions from '../promotionOptions';
import { PROMOTION_OPTION_QUERIES } from '../promotionOptionConstants';
import { proPromotionOptionFragment } from './promotionOptionFragments';

export default PromotionOptions.createQuery(
  PROMOTION_OPTION_QUERIES.PRO_PROMOTION_OPTIONS,
  {
    $filter({ filters, params: { promotionOptionIds } }) {
      console.log('promotionOptionIds', promotionOptionIds);

      filters._id = { $in: promotionOptionIds };
    },
    ...proPromotionOptionFragment,
  },
);
