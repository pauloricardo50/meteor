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

// export const isAllowedToModifyPromotion = (promotion) => {
//   if (
//     [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION].includes(promotion.status)
//   ) {
//     return true;
//   }

//   if (SecurityService.minimumRole(ROLES.ADMIN)) {
//     return true;
//   }

//   if (SecurityService.canModifyDoc(promotion)) {
//     return true;
//   }

//   return false;
// };

export const isAllowedToInviteCustomersToPromotion = ({
  promotion,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const permissions = { canViewPromotion: true, canInviteCustomers: true };

  if (promotion.status !== PROMOTION_STATUS.OPEN) {
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

  if (
    ![PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION].includes(promotion.status)
  ) {
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

export const isAllowedToManagePromotionDocuments = ({
  promotion,
  currentUser,
}) => {
  const { _id: userId } = currentUser;
  const permissions = { canViewPromotion: true, canManageDocuments: true };

  if (
    ![PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION].includes(promotion.status)
  ) {
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
