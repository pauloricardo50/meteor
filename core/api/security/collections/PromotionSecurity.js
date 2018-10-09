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
}

export default PromotionSecurity;
