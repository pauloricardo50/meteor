import SecurityService from '../../security';
import PromotionLotService from './PromotionLotService';
import {
  promotionLotInsert,
  promotionLotUpdate,
  promotionLotRemove,
  addLotToPromotionLot,
  removeLotLink,
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
  confirmPromotionLotBooking,
} from '../methodDefinitions';

import { expirePromotionLotBooking } from './serverMethods';

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

bookPromotionLot.setHandler(({ userId }, params) => {
  const { promotionOptionId } = params;
  SecurityService.promotions.isAllowedToBookLots({
    promotionOptionId,
    userId,
  });
  SecurityService.promotions.isAllowedToManagePromotionReservation({
    promotionOptionId,
    userId,
  });
  return PromotionLotService.bookPromotionLot(params);
});

cancelPromotionLotBooking.setHandler(({ userId }, params) => {
  const { promotionOptionId } = params;
  SecurityService.promotions.isAllowedToManagePromotionReservation({
    promotionOptionId,
    userId,
  });
  return PromotionLotService.cancelPromotionLotBooking(params);
});

confirmPromotionLotBooking.setHandler(({ userId }, params) => {
  // According to promotions process v1.1 - 201909
  // Only admins can book promotionLots
  SecurityService.checkUserIsAdmin(userId);
  return PromotionLotService.confirmPromotionLotBooking(params);
});

sellPromotionLot.setHandler(({ userId }, params) => {
  // According to promotions process v1.1 - 201909
  // Only admins can sell promotionLots
  SecurityService.checkUserIsAdmin(userId);
  return PromotionLotService.sellPromotionLot(params);
});

expirePromotionLotBooking.setHandler((context, params) =>
  PromotionLotService.expirePromotionLotBooking(params));
