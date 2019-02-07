import SecurityService from '../../security';
import PromotionService from './PromotionService';
import {
  promotionInsert,
  promotionUpdate,
  promotionRemove,
  insertPromotionProperty,
  inviteUserToPromotion,
  setPromotionUserPermissions,
  addProUserToPromotion,
  removeProFromPromotion,
  sendPromotionInvitationEmail,
  removeUserFromPromotion,
} from '../methodDefinitions';

promotionInsert.setHandler(({ userId }, { promotion }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.insert({ promotion, userId });
});

promotionUpdate.setHandler(({ userId }, { promotionId, object }) => {
  SecurityService.promotions.isAllowedToUpdate(promotionId, userId);
  return PromotionService.update({ promotionId, object });
});

promotionRemove.setHandler(({ userId }, { promotionId }) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionService.remove(promotionId);
});

insertPromotionProperty.setHandler(({ userId }, { promotionId, property }) => {
  SecurityService.promotions.isAllowedToUpdate(promotionId, userId);
  return PromotionService.insertPromotionProperty({ promotionId, property });
});

inviteUserToPromotion.setHandler(({ userId }, { user, promotionId }) => {
  SecurityService.promotions.isAllowedToInviteCustomers({
    promotionId,
    userId,
  });
  // SecurityService.promotions.isAllowedToUpdate(promotionId, userId);
  return PromotionService.inviteUser({ promotionId, user });
});

setPromotionUserPermissions.setHandler(({ userId: currentUserId }, { promotionId, userId, permissions }) => {
  SecurityService.checkUserIsAdmin(currentUserId);
  return PromotionService.setUserPermissions({
    promotionId,
    userId,
    permissions,
  });
});

addProUserToPromotion.setHandler(({ userId: currentUserId }, { promotionId, userId }) => {
  SecurityService.checkUserIsAdmin(currentUserId);
  return PromotionService.addProUser({ promotionId, userId });
});

removeProFromPromotion.setHandler(({ userId: currentUserId }, { promotionId, userId }) => {
  SecurityService.checkUserIsAdmin(currentUserId);
  return PromotionService.removeProUser({ promotionId, userId });
});

sendPromotionInvitationEmail.setHandler(({ userId }, params) => {
  SecurityService.promotions.isAllowedToRead(params.promotionId, userId);
  return PromotionService.sendPromotionInvitationEmail(params);
});

removeUserFromPromotion.setHandler(({ userId }, params) => {
  SecurityService.promotions.isAllowedToUpdate(params.promotionId, userId);
  return PromotionService.removeUser(params);
});
