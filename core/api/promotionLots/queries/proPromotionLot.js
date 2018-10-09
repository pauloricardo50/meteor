import PromotionLots from '../promotionLots';
import { PROMOTION_LOT_QUERIES } from '../promotionLotConstants';
import { proPromotionLotFragment } from './promotionLotFragments';

export default PromotionLots.createQuery(
  PROMOTION_LOT_QUERIES.PRO_PROMOTION_LOT,
  {
    $filter({ filters, params: { promotionLotId } }) {
      filters._id = promotionLotId;
    },
    ...proPromotionLotFragment,
  },
);
