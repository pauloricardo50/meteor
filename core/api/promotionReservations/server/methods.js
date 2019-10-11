import SecurityService from '../../security';
import PromotionReservationService from './PromotionReservationService';
import {
  promotionReservationInsert,
  promotionReservationRemove,
  promotionReservationUpdate,
  promotionReservationUpdateObject,
} from '../methodDefinitions';

promotionReservationInsert.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionReservationService.insert(params);
});

promotionReservationRemove.setHandler(({ userId }, { promotionReservationId }) => {
  SecurityService.checkUserIsAdmin(userId);
  PromotionReservationService.remove(promotionReservationId);
});

promotionReservationUpdate.setHandler(({ userId }, { promotionReservationId, object }) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionReservationService._update({
    id: promotionReservationId,
    object,
  });
});

promotionReservationUpdateObject.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionReservationService.updateStatusObject(params);
});
