import PromotionLots from '.';
import { PROMOTION_LOT_QUERIES } from './promotionLotConstants';
import { appPromotionLot as appPromotionLotFragment } from '../fragments';

export const appPromotionLot = PromotionLots.createQuery(
  PROMOTION_LOT_QUERIES.APP_PROMOTION_LOT,
  {
    $filter({ filters, params: { promotionLotId } }) {
      filters._id = promotionLotId;
    },
    ...appPromotionLotFragment(),
  },
);

export const proPromotionLot = PromotionLots.createQuery(
  PROMOTION_LOT_QUERIES.PRO_PROMOTION_LOT,
  () => {},
);
