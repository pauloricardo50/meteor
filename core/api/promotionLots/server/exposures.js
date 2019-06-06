import SecurityService from '../../security';
import { appPromotionLot, proPromotionLot } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';
import PromotionLotService from './PromotionLotService';
import { makePromotionLotAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proPromotionLot as proPromotionLotFragment } from '../../fragments';

exposeQuery(
  appPromotionLot,
  {
    firewall(userId, { promotionLotId }) {
      SecurityService.promotions.hasAccessToPromotionLot({
        promotionLotId,
        userId,
      });
    },
    validateParams: { promotionLotId: String },
  },
  {},
);

exposeQuery(proPromotionLot, {
  firewall(userId, params) {
    const { promotionLotId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToViewPromotionLot({
      promotionLotId,
      userId,
    });
  },
  validateParams: { promotionLotId: String, userId: String },
});

proPromotionLot.resolve(({ userId, promotionLotId }) => {
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
});
