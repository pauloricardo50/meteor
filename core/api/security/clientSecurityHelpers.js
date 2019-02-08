import { Meteor } from 'meteor/meteor';

import { PROMOTION_STATUS, ROLES } from '../constants';
import SecurityService from './Security';

const hasMinimumRole = ({ role, userId }) => {
  try {
    SecurityService.minimumRole(role)(userId);
    return true;
  } catch (error) {
    return false;
  }
};

export const isAllowedToModifyPromotion = (promotion) => {
  if (
    [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION].includes(promotion.status)
  ) {
    return true;
  }

  if (SecurityService.minimumRole(ROLES.ADMIN)) {
    return true;
  }

  if (SecurityService.canModifyDoc(promotion)) {
    return true;
  }

  return false;
};

export const isAllowedToInviteCustomersToPromotion = (promotion, userId) => {
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
