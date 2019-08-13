import { appPromotionLot, proPromotionLot } from '../fragments';
import { PROMOTION_LOT_QUERIES } from './promotionLotConstants';
import PromotionLots from '.';

export const appPromotionLots = PromotionLots.createQuery(
  PROMOTION_LOT_QUERIES.APP_PROMOTION_LOT,
  appPromotionLot(),
);

export const proPromotionLots = PromotionLots.createQuery(
  PROMOTION_LOT_QUERIES.PRO_PROMOTION_LOT,
  proPromotionLot(),
);
