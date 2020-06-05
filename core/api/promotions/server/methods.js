import SecurityService from '../../security';
import {
  addProUserToPromotion,
  addPromotionLotGroup,
  editPromotionLoan,
  insertPromotionProperty,
  promotionInsert,
  promotionRemove,
  promotionSetStatus,
  promotionUpdate,
  removeLoanFromPromotion,
  removeProFromPromotion,
  removePromotionLotGroup,
  reuseConstructionTimeline,
  sendPromotionInvitationEmail,
  setPromotionUserPermissions,
  toggleNotifications,
  updatePromotionLotGroup,
  updatePromotionUserRoles,
} from '../methodDefinitions';
import PromotionService from './PromotionService';

promotionInsert.setHandler(({ userId }, { promotion }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.insert({ promotion, userId });
});

promotionUpdate.setHandler(({ userId }, { promotionId, object }) => {
  SecurityService.promotions.isAllowedToModify({ promotionId, userId });
  return PromotionService.update({ promotionId, object });
});

promotionRemove.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionService.remove(params);
});

insertPromotionProperty.setHandler(({ userId }, { promotionId, property }) => {
  SecurityService.promotions.isAllowedToAddLots({ promotionId, userId });
  return PromotionService.insertPromotionProperty({ promotionId, property });
});

setPromotionUserPermissions.setHandler(
  ({ userId: currentUserId }, { promotionId, userId, permissions }) => {
    SecurityService.checkUserIsAdmin(currentUserId);
    return PromotionService.setUserPermissions({
      promotionId,
      userId,
      permissions,
    });
  },
);

addProUserToPromotion.setHandler(
  ({ userId: currentUserId }, { promotionId, userId }) => {
    SecurityService.checkUserIsAdmin(currentUserId);
    return PromotionService.addProUser({ promotionId, userId });
  },
);

removeProFromPromotion.setHandler(
  ({ userId: currentUserId }, { promotionId, userId }) => {
    SecurityService.checkUserIsAdmin(currentUserId);
    return PromotionService.removeProUser({ promotionId, userId });
  },
);

sendPromotionInvitationEmail.setHandler(({ userId }, params) => {
  SecurityService.promotions.isAllowedToInviteCustomers({
    promotionId: params.promotionId,
    userId,
  });
  return PromotionService.sendPromotionInvitationEmail(params);
});

removeLoanFromPromotion.setHandler(({ userId }, params) => {
  const { promotionId, loanId } = params;
  SecurityService.promotions.isAllowedToRemoveCustomer({
    promotionId,
    loanId,
    userId,
  });
  return PromotionService.removeLoan(params);
});

editPromotionLoan.setHandler(({ userId }, params) => {
  const { promotionId, loanId } = params;
  SecurityService.promotions.isAllowedToSeePromotionCustomer({
    promotionId,
    loanId,
    userId,
  });
  return PromotionService.editPromotionLoan(params);
});

reuseConstructionTimeline.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionService.reuseConstructionTimeline(params);
});

toggleNotifications.setHandler(({ userId }, { promotionId }) => {
  SecurityService.checkUserIsPro(userId);
  SecurityService.promotions.isAllowedToView({ userId, promotionId });
  return PromotionService.toggleNotifications({ userId, promotionId });
});

updatePromotionUserRoles.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionService.updateUserRoles(params);
});

promotionSetStatus.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return PromotionService.setStatus(params);
});

addPromotionLotGroup.setHandler(
  ({ userId }, { promotionId, ...promotionLotGroup }) => {
    SecurityService.promotions.isAllowedToModify({ promotionId, userId });
    return PromotionService.addPromotionLotGroup({
      promotionId,
      promotionLotGroup,
    });
  },
);

removePromotionLotGroup.setHandler(
  ({ userId }, { promotionId, promotionLotGroupId }) => {
    SecurityService.promotions.isAllowedToModify({ promotionId, userId });
    return PromotionService.removePromotionLotGroup({
      promotionId,
      promotionLotGroupId,
    });
  },
);

updatePromotionLotGroup.setHandler(
  ({ userId }, { promotionId, promotionLotGroupId, ...object }) => {
    SecurityService.promotions.isAllowedToModify({ promotionId, userId });
    return PromotionService.updatePromotionLotGroup({
      promotionId,
      promotionLotGroupId,
      object,
    });
  },
);
