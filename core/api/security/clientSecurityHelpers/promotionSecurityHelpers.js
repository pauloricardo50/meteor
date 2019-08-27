import { PROMOTION_STATUS, ROLES } from '../../constants';
import SecurityService from '../Security';
import {
  shouldAnonymize,
  getCurrentUserPermissionsForPromotion,
} from '../../promotions/promotionClientHelpers';
import { hasMinimumRole } from './generalSecurityHelpers';

const checkPromotionPermissions = ({
  promotion,
  userId,
  requiredPermissions,
  promotionStatus = [],
}) => {
  if (promotionStatus.length && !promotionStatus.includes(promotion.status)) {
    return false;
  }

  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  try {
    SecurityService.hasPermissionOnDoc({
      doc: promotion,
      requiredPermissions,
      userId,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const isAllowedToViewPromotion = ({
  promotion,
  currentUser: { _id: userId },
}) => {
  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  const { userLinks = [], users = [] } = promotion;

  const user = userLinks.find(({ _id }) => _id === userId)
    || users.find(({ _id }) => _id === userId);

  if (!user) {
    return false;
  }

  return true;
};

export const isAllowedToInviteCustomersToPromotion = ({
  promotion,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canInviteCustomers: true };

  return checkPromotionPermissions({
    promotion,
    userId,
    requiredPermissions,
    promotionStatus: [PROMOTION_STATUS.OPEN],
  });
};

export const isAllowedToRemoveCustomerFromPromotion = ({
  promotion,
  currentUser,
  customerOwnerType,
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
    && !shouldAnonymize({ customerOwnerType, permissions })
  );
};

export const isAllowedToModifyPromotion = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canModifyPromotion: true };

  return checkPromotionPermissions({
    promotion,
    userId,
    requiredPermissions,
    promotionStatus: [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION],
  });
};

export const isAllowedToManagePromotionDocuments = ({
  promotion,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canManageDocuments: true };

  return checkPromotionPermissions({
    promotion,
    userId,
    requiredPermissions,
    promotionStatus: [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION],
  });
};

export const isAllowedToSeePromotionCustomers = ({
  promotion,
  currentUser,
}) => {
  const { _id: userId } = currentUser;

  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  const { userLinks = [], users = [] } = promotion;

  const user = userLinks.find(({ _id }) => _id === userId)
    || users.find(({ _id }) => _id === userId);

  if (!user) {
    return false;
  }

  const userPermissions = user.permissions || user.$metadata.permissions;

  if (userPermissions.displayCustomerNames === false) {
    return false;
  }

  return true;
};

export const isAllowedToAddLotsToPromotion = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = {
    canModifyPromotion: true,
    canAddLots: true,
  };

  return checkPromotionPermissions({ promotion, userId, requiredPermissions });
};

export const isAllowedToModifyPromotionLots = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = {
    canModifyPromotion: true,
    canModifyLots: true,
  };

  return checkPromotionPermissions({ promotion, userId, requiredPermissions });
};

export const isAllowedToRemovePromotionLots = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = {
    canModifyPromotion: true,
    canRemoveLots: true,
  };

  return checkPromotionPermissions({ promotion, userId, requiredPermissions });
};

export const isAllowedToBookPromotionLots = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canBookLots: true };

  return checkPromotionPermissions({ promotion, userId, requiredPermissions });
};

export const isAllowedToBookPromotionLotToCustomer = ({
  promotion,
  currentUser,
  customerOwnerType,
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
    isAllowedToBookPromotionLots({ promotion, currentUser })
    && !shouldAnonymize({ customerOwnerType, permissions })
  );
};

export const isAllowedToSellPromotionLots = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = {
    canSellLots: true,
  };

  return checkPromotionPermissions({ promotion, userId, requiredPermissions });
};

export const isAllowedToSellPromotionLotToCustomer = ({
  promotion,
  currentUser,
  customerOwnerType,
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
    isAllowedToSellPromotionLots({ promotion, currentUser })
    && !shouldAnonymize({ customerOwnerType, permissions })
  );
};
