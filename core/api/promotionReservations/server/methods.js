import SecurityService from '../../security';
import PromotionReservationService from './PromotionReservationService';
import {
  promotionReservationInsert,
  promotionReservationRemove,
  promotionReservationUpdate,
} from '../methodDefinitions';

promotionReservationInsert.setHandler(({ userId }, params) => {
  const { promotionOptionId } = params;
  SecurityService.promotions.isAllowedToManagePromotionReservation({
    promotionOptionId,
    userId,
  });
  return PromotionReservationService.insert(params);
});

promotionReservationRemove.setHandler(({ userId }, { promotionReservationId }) => {
  const {
    promotionOption: { _id: promotionOptionId },
  } = PromotionReservationService.safeFetchOne({
    $filters: { _id: promotionReservationId },
    promotionOption: { _id: 1 },
  });
  SecurityService.promotions.isAllowedToManagePromotionReservation({
    promotionOptionId,
    userId,
  });
  return PromotionReservationService.remove(promotionReservationId);
});

promotionReservationUpdate.setHandler(({ userId }, { promotionReservationId, object }) => {
  const {
    promotionOption: { _id: promotionOptionId },
  } = PromotionReservationService.safeFetchOne({
    $filters: { _id: promotionReservationId },
    promotionOption: { _id: 1 },
  });
  SecurityService.promotions.isAllowedToManagePromotionReservation({
    promotionOptionId,
    userId,
  });
  return PromotionReservationService._update({
    id: promotionReservationId,
    object,
  });
});
