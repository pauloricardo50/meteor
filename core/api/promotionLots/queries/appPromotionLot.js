import PromotionLots from '../promotionLots';
import { PROMOTION_LOT_QUERIES } from '../promotionLotConstants';
import { appPromotionLot } from '../../fragments';

export default PromotionLots.createQuery(
  PROMOTION_LOT_QUERIES.APP_PROMOTION_LOT,
  {
    $filter({ filters, params: { promotionLotId } }) {
      filters._id = promotionLotId;
    },
    ...appPromotionLot(),
  },
);
