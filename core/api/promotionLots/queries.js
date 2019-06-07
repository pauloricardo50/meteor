import { appPromotionLot as appPromotionLotFragment } from '../fragments';
import { PROMOTION_LOT_QUERIES } from './promotionLotConstants';
import PromotionLots from '.';

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
