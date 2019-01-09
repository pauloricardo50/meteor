import { PROMOTION_STATUS } from '../../constants';
import { Promotions } from '../..';
import UserService from '../../users/UserService';
import Security from '../Security';

class PromotionSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToRead(promotionId, userId) {
    try {
      this.isAllowedToUpdate(promotionId);
    } catch (error) {
      if (!error) {
        return;
      }

      const hasPromotion = UserService.hasPromotion({ userId, promotionId });

      if (!hasPromotion) {
        Security.handleUnauthorized("Vous n'avez pas accès à cette promotion");
      }
    }
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
