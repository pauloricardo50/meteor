import { PROMOTION_STATUS, ROLES } from '../constants';
import SecurityService from './Security';

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
