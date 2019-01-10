import { PROMOTION_STATUS } from '../../constants';
import PromotionService from '../../promotions/PromotionService';
import PromotionLotService from '../../promotionLots/PromotionLotService';
import PromotionOptionService from '../../promotionOptions/PromotionOptionService';
import UserService from '../../users/UserService';
import Security from '../Security';
import { ROLES } from '../../users/userConstants';
import LoanSecurity from './LoanSecurity';

class PromotionSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToReadPromotionOption(promotionOptionId, userId) {
    const { loan, promotionLots } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1, userId: 1 },
      promotionLots: { _id: 1 },
    });

    if (Security.hasRole(userId, ROLES.PRO)) {
      this.isAllowedToReadPromotionLot(promotionLots[0]._id, userId);
    } else {
      LoanSecurity.isAllowedToUpdate(loan && loan._id);
    }
  }

  static isAllowedToReadPromotionLot(promotionLotId, userId) {
    const { promotion } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1 },
    });

    if (promotion && promotion._id) {
      this.isAllowedToRead(promotion._id, userId);
    } else {
      Security.handleUnauthorized("Vous n'avez pas accès à ce lot");
    }
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

    const promotion = PromotionService.findOne(promotionId);
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
