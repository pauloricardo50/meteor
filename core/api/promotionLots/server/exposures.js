import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { appPromotionLot, proPromotionLot } from '../queries';
import { proPromotionLotResolver } from './resolvers';

exposeQuery({
  query: appPromotionLot,
  overrides: {
    firewall(userId, { promotionLotId }) {
      SecurityService.promotions.hasAccessToPromotionLot({
        promotionLotId,
        userId,
      });
    },
    validateParams: { promotionLotId: String },
  },
});

exposeQuery({
  query: proPromotionLot,
  overrides: {
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
  },
  resolver: proPromotionLotResolver,
});
