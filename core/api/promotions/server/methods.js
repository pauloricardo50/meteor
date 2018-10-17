import SecurityService from '../../security';
import PromotionService from '../PromotionService';

import {
  promotionInsert,
  promotionUpdate,
  promotionRemove,
  insertPromotionProperty,
  inviteUserToPromotion,
  sendPromotionInvitationEmail,
} from '../methodDefinitions';

promotionInsert.setHandler(({ userId }, { promotion }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.insert({ promotion, userId });
});

promotionUpdate.setHandler(({ userId }, { promotionId, object }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.update({ promotionId, object });
});

promotionRemove.setHandler(({ userId }, { promotionId }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.remove(promotionId);
});

insertPromotionProperty.setHandler(({ userId }, { promotionId, property }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.insertPromotionProperty({ promotionId, property });
});

inviteUserToPromotion.setHandler(({ userId }, { user, promotionId }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.inviteUser({ promotionId, user });
});

sendPromotionInvitationEmail.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.sendPromotionInvitationEmail(params);
});
