import { PROMOTION_STATUS } from '../constants';
import SecurityService from './Security';

export const isAllowedToModifyPromotion = promotion =>
  [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION].includes(promotion.status) && SecurityService.canModifyDoc(promotion);
