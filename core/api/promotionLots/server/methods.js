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

bookPromotionLot.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionLotService.bookPromotionLot(params);
});

cancelPromotionLotBooking.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionLotService.cancelPromotionLotBooking(params);
});

sellPromotionLot.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionLotService.sellPromotionLot(params);
});
