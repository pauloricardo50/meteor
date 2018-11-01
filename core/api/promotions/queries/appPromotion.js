import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';
import { proPromotionFragment } from './promotionFragments';

export default Promotions.createQuery(PROMOTION_QUERIES.APP_PROMOTION, {
  $filter({ filters, params: { promotionId } }) {
    filters._id = promotionId;
  },
  ...proPromotionFragment,
  loans: {
    $filter({ filters, params: { loanId } }) {
      filters._id = loanId;
    },
  },
});
