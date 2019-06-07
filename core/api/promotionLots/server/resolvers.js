import PromotionLotService from './PromotionLotService';
import { proPromotionLot as proPromotionLotFragment } from '../../fragments';
import SecurityService from '../../security';
import { makePromotionLotAnonymizer } from '../../promotions/server/promotionServerHelpers';

export const proPromotionLotResolver = ({ userId, promotionLotId }) => {
  const promotionLot = PromotionLotService.fetchOne({
    $filters: { _id: promotionLotId },
    ...proPromotionLotFragment(),
  });

  try {
    SecurityService.checkCurrentUserIsAdmin(userId);
    return [promotionLot];
  } catch (error) {
    return [promotionLot].map(makePromotionLotAnonymizer({ userId }));
  }
};
