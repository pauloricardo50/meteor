import { Meteor } from 'meteor/meteor';

import { PROMOTION_STATUS, ROLES } from '../constants';
import SecurityService from './Security';
import {
  shouldAnonymize,
  getCurrentUserPermissionsForPromotion,
} from '../promotions/promotionClientHelpers';

const hasMinimumRole = ({ role, userId }) => {
  try {
    SecurityService.minimumRole(role)(userId);
    return true;
  } catch (error) {
    return false;
  }
};

const checkPromotionPermissions = ({
  promotion,
  userId,
  permissions,
  promotionStatus = [],
}) => {
  if (promotionStatus.length && !promotionStatus.includes(promotion.status)) {
    return false;
  }

  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  try {
    SecurityService.hasPermissionOnDoc({ doc: promotion, permissions, userId });
    return true;
  } catch (error) {
    return false;
  }
};

export const isAllowedToViewPromotion = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const permissions = { canViewPromotion: true };

  return checkPromotionPermissions({
    promotion,
    userId,
    permissions,
  });
};

export const isAllowedToInviteCustomersToPromotion = ({
  promotion,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const permissions = { canViewPromotion: true, canInviteCustomers: true };

  return checkPromotionPermissions({
    promotion,
    userId,
    permissions,
    promotionStatus: [PROMOTION_STATUS.OPEN],
  });
};

export const isAllowedToRemoveCustomerFromPromotion = ({
  promotion,
  currentUser,
  customerOwningGroup,
}) => {
  const { _id: userId } = currentUser;
  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }
  const { _id: promotionId } = promotion;
  const permissions = getCurrentUserPermissionsForPromotion({
    currentUser,
    promotionId,
  });
  return (
    isAllowedToInviteCustomersToPromotion({ promotion, currentUser })
    && !shouldAnonymize({ customerOwningGroup, permissions })
  );
};

export const isAllowedToModifyPromotion = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const permissions = { canViewPromotion: true, canModifyPromotion: true };

  return checkPromotionPermissions({
    promotion,
    userId,
    permissions,
    promotionStatus: [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION],
  });
};

export const isAllowedToManagePromotionDocuments = ({
  promotion,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const permissions = { canViewPromotion: true, canManageDocuments: true };

  return checkPromotionPermissions({
    promotion,
    userId,
    permissions,
    promotionStatus: [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION],
  });
};

export const isAllowedToSeePromotionCustomers = ({
  promotion,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const permissions = { canViewPromotion: true, canSeeCustomers: true };

  return checkPromotionPermissions({ promotion, userId, permissions });
};

export const isAllowedToAddLotsToPromotion = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const permissions = {
    canViewPromotion: true,
    canModifyPromotion: true,
    canAddLots: true,
  };

  return checkPromotionPermissions({ promotion, userId, permissions });
};

export const isAllowedToModifyPromotionLots = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const permissions = {
    canViewPromotion: true,
    canModifyPromotion: true,
    canModifyLots: true,
  };

  return checkPromotionPermissions({ promotion, userId, permissions });
};

export const isAllowedToRemovePromotionLots = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const permissions = {
    canViewPromotion: true,
    canModifyPromotion: true,
    canRemoveLots: true,
  };

  return checkPromotionPermissions({ promotion, userId, permissions });
};
