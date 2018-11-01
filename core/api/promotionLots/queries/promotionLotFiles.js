// @flow
import PromotionLots from '../promotionLots';
import { PROMOTION_LOT_QUERIES } from '../../constants';

export default PromotionLots.createQuery(
  PROMOTION_LOT_QUERIES.PROMOTION_LOT_FILES,
  {
    $filter({ filters, params: { promotionLotId } }) {
      filters._id = promotionLotId;
    },
    documents: 1,
  },
);
