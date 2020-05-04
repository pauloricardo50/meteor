import {
  getCurrentUserPermissionsForPromotion,
  shouldAnonymize,
} from '../../promotions/promotionClientHelpers';
import { PROMOTION_STATUS } from '../../promotions/promotionConstants';
import { ROLES } from '../../users/userConstants';
import SecurityService from '../Security';
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

  const user =
    userLinks.find(({ _id }) => _id === userId) ||
    users.find(({ _id }) => _id === userId);

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
    isAllowedToInviteCustomersToPromotion({ promotion, currentUser }) &&
    !shouldAnonymize({ customerOwnerType, permissions })
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

  const user =
    userLinks.find(({ _id }) => _id === userId) ||
    users.find(({ _id }) => _id === userId);

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

export const isAllowedToReservePromotionLots = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canReserveLots: true };

  return checkPromotionPermissions({ promotion, userId, requiredPermissions });
};

export const isAllowedToReservePromotionLotToCustomer = ({
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
    isAllowedToReservePromotionLots({ promotion, currentUser }) &&
    !shouldAnonymize({ customerOwnerType, permissions })
  );
};

export const isAllowedToManageCustomerPromotionReservation = ({
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
  return !shouldAnonymize({ customerOwnerType, permissions });
};

export const isAllowedToSeeManagement = ({ promotion, currentUser }) => {
  const { _id: userId } = currentUser;
  const requiredPermissions = { canSeeManagement: true };

  return checkPromotionPermissions({
    promotion,
    userId,
    requiredPermissions,
  });
};
