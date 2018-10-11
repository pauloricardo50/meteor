import SecurityService from '../../security';
import PromotionLotService from '../PromotionLotService';
import {
  promotionLotInsert,
  promotionLotUpdate,
  addLotToPromotionLot,
  removeLotLink,
  bookPromotionLot,
  cancelPromotionLotBooking,
  sellPromotionLot,
} from '../methodDefinitions';

promotionLotInsert.setHandler(({ userId }, { promotionLot, promotionId }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionLotService.insert({ promotionLot, promotionId });
});

promotionLotUpdate.setHandler(({ userId }, { promotionLotId, object }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionLotService.update({ promotionLotId, object });
});

addLotToPromotionLot.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionLotService.addLotToPromotionLot(params);
});

removeLotLink.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
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
