import { PROMOTION_STATUS } from 'core/api/constants';
import Security from '../Security';
import { Promotions } from '../..';

class PromotionSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(promotionId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const promotion = Promotions.findOne(promotionId);
    Security.checkOwnership(promotion);
  }

  static isAllowedToDelete() {
    Security.checkCurrentUserIsAdmin();
  }

  static isAllowedToModify(promotion) {
    return (
      [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.PREPARATION].includes(promotion.status) && Security.canModifyDoc(promotion)
    );
  }
}

export default PromotionSecurity;
