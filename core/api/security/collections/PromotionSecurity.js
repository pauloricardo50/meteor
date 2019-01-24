import { PROMOTION_STATUS } from '../../constants';
import PromotionService from '../../promotions/server/PromotionService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import Security from '../Security';
import LoanSecurity from './LoanSecurity';
import { DOCUMENT_USER_PERMISSIONS } from '../constants';

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
      const promotion = PromotionService.safeGet(promotionId);
      Security.hasPermissionOnDoc(
        promotion,
        [DOCUMENT_USER_PERMISSIONS.READ, DOCUMENT_USER_PERMISSIONS.MODIFY],
        userId,
      );
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

  static isAllowedToUpdate(promotionId, userId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const promotion = PromotionService.safeGet(promotionId);
    Security.checkOwnership(promotion);
    Security.hasPermissionOnDoc(
      promotion,
      [DOCUMENT_USER_PERMISSIONS.MODIFY],
      userId,
    );
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
