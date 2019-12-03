import SecurityService from '../../security';
import PromotionLotService from './PromotionLotService';
import {
  promotionLotInsert,
  promotionLotUpdate,
  promotionLotRemove,
  addLotToPromotionLot,
  removeLotLink,
  reservePromotionLot,
  cancelPromotionLotReservation,
  sellPromotionLot,
} from '../methodDefinitions';

promotionLotInsert.setHandler(({ userId }, { promotionLot, promotionId }) => {
  SecurityService.promotions.isAllowedToAddLots({ promotionId, userId });
  return PromotionLotService.insert({ promotionLot, promotionId });
});

promotionLotUpdate.setHandler(({ userId }, { promotionLotId, object }) => {
  SecurityService.promotions.isAllowedToModifyPromotionLot({
    promotionLotId,
    userId,
  });
  return PromotionLotService.update({ promotionLotId, object });
});

promotionLotRemove.setHandler(({ userId }, { promotionLotId }) => {
  SecurityService.promotions.isAllowedToRemovePromotionLot({
    promotionLotId,
    userId,
  });
  return PromotionLotService.remove(promotionLotId);
});

addLotToPromotionLot.setHandler(({ userId }, params) => {
  SecurityService.promotions.isAllowedToModifyPromotionLot({
    ...params,
    userId,
  });
  return PromotionLotService.addLotToPromotionLot(params);
});

removeLotLink.setHandler(({ userId }, params) => {
  SecurityService.promotions.isAllowedToModifyPromotionLot({
    ...params,
    userId,
  });
  return PromotionLotService.removeLotLink(params);
});

reservePromotionLot.setHandler(({ userId }, params) => {
  const { promotionOptionId } = params;
  SecurityService.promotions.isAllowedToReserveLots({
    promotionOptionId,
    userId,
  });
  SecurityService.promotions.isAllowedToManagePromotionReservation({
    promotionOptionId,
    userId,
  });
  return PromotionLotService.reservePromotionLot(params);
});

cancelPromotionLotReservation.setHandler(({ userId }, params) => {
  const { promotionOptionId } = params;
  SecurityService.promotions.isAllowedToManagePromotionReservation({
    promotionOptionId,
    userId,
  });
  return PromotionLotService.cancelPromotionLotReservation(params);
});

sellPromotionLot.setHandler(({ userId }, params) => {
  // According to promotions process v1.1 - 201909
  // Only admins can sell promotionLots
  SecurityService.checkUserIsAdmin(userId);
  return PromotionLotService.sellPromotionLot(params);
});
