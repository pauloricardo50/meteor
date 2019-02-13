import { PROMOTION_STATUS } from '../../constants';
import PromotionService from '../../promotions/server/PromotionService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import Security from '../Security';
import LoanSecurity from './LoanSecurity';
import { DOCUMENT_USER_PERMISSIONS } from '../constants';
import {
  isAllowedToInviteCustomersToPromotion,
  isAllowedToRemoveCustomerFromPromotion,
  isAllowedToModifyPromotion,
  isAllowedToManagePromotionDocuments,
  isAllowedToAddLotsToPromotion,
  isAllowedToModifyPromotionLots,
  isAllowedToRemovePromotionLots,
  isAllowedToViewPromotion,
  isAllowedToBookPromotionLots,
  isAllowedToBookPromotionLotToCustomer,
  isAllowedToSellPromotionLots,
  isAllowedToSellPromotionLotToCustomer,
} from '../clientSecurityHelpers';
import LoanService from '../../loans/server/LoanService';
import { getPromotionCustomerOwningGroup } from '../../promotions/server/promotionServerHelpers';
import {
  proPromotion,
  proUser,
  proLoans,
  proPromotionLot,
} from '../../fragments';
import LotService from '../../lots/server/LotService';

class PromotionSecurity {
  static checkPermissions({
    promotionId,
    userId,
    checkingFunction,
    errorMessage,
  }) {
    if (Security.currentUserIsAdmin()) {
      return;
    }
    const promotion = PromotionService.fetchOne({
      $filters: { _id: promotionId },
      ...proPromotion(),
    });
    const currentUser = UserService.fetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    if (!checkingFunction({ promotion, currentUser })) {
      Security.handleUnauthorized(errorMessage || 'Checking permissions');
    }
  }

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
    if (Security.currentUserIsAdmin()) {
      return;
    }

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

  static isAllowedToModify({ promotionId, userId }) {
    this.checkPermissions({
      promotionId,
      userId,
      checkingFunction: isAllowedToModifyPromotion,
      errorMessage: 'Vous ne pouvez pas modifier cette promotion',
    });
  }

  static isAllowedToManageDocuments({ promotionId, userId }) {
    this.checkPermissions({
      promotionId,
      userId,
      checkingFunction: isAllowedToManagePromotionDocuments,
      errorMessage: 'Vous ne pouvez pas gérer les documents de cette promotion',
    });
  }

  static isAllowedToManagePromotionLotDocuments({ propertyId, userId }) {
    const { promotion } = PromotionLotService.fetchOne({
      $filters: { 'propertyLinks._id': propertyId },
      promotion: { _id: 1 },
    });

    this.isAllowedToManageDocuments({ promotionId: promotion._id, userId });
  }

  static isAllowedToAddLots({ promotionId, userId }) {
    this.checkPermissions({
      promotionId,
      userId,
      checkingFunction: isAllowedToAddLotsToPromotion,
      errorMessage: 'Vous ne pouvez pas ajouter de lots à cette promotion',
    });
  }

  static isAllowedToModifyLots({ promotionId, userId }) {
    this.checkPermissions({
      promotionId,
      userId,
      checkingFunction: isAllowedToModifyPromotionLots,
      errorMessage: 'Vous ne pouvez pas modifier les lots de cette promotion',
    });
  }

  static isAllowedToRemoveLots({ promotionId, userId }) {
    this.checkPermissions({
      promotionId,
      userId,
      checkingFunction: isAllowedToRemovePromotionLots,
      errorMessage: 'Vous ne pouvez pas supprimer les lots de cette promotion',
    });
  }

  static isAllowedToInviteCustomers({ promotionId, userId }) {
    this.checkPermissions({
      promotionId,
      userId,
      checkingFunction: isAllowedToInviteCustomersToPromotion,
      errorMessage: 'Vous ne pouvez pas inviter des clients à cette promotion',
    });
  }

  static isAllowedToRemoveCustomer({ promotionId, loanId, userId }) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const promotion = PromotionService.fetchOne({
      $filters: { _id: promotionId },
      ...proPromotion(),
    });
    const currentUser = UserService.fetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      ...proLoans(),
    });

    const customerOwningGroup = getPromotionCustomerOwningGroup({
      customerId: loan.user._id,
      userId,
      promotionId,
    });

    if (
      !isAllowedToRemoveCustomerFromPromotion({
        promotion,
        currentUser,
        customerOwningGroup,
      })
    ) {
      Security.handleUnauthorized('Vous ne pouvez pas supprimer ce client de cette promotion');
    }
  }

  static isAllowedToView({ promotionId, userId }) {
    this.checkPermissions({
      promotionId,
      userId,
      checkingFunction: isAllowedToViewPromotion,
      errorMessage: "Vous n'avez pas accès à cette promotion",
    });
  }

  static isAllowedToViewPromotionLot({ promotionLotId, userId }) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const {
      promotion: { _id: promotionId },
    } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1 },
    });

    this.isAllowedToView({ promotionId, userId });
  }

  static isAllowedToViewPromotionOption({ promotionOptionId, userId }) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const { promotionLots = [] } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: { _id: 1 },
    });

    promotionLots.forEach(({ _id: promotionLotId }) => {
      this.isAllowedToViewPromotionLot({ promotionLotId, userId });
    });
  }

  static isAllowedToModifyPromotionLot({ promotionLotId, userId }) {
    const { promotion } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1 },
    });

    this.isAllowedToModifyLots({ promotionId: promotion._id, userId });
  }

  static isAllowedToRemovePromotionLot({ promotionLotId, userId }) {
    const { promotion } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1 },
    });

    this.isAllowedToRemoveLots({ promotionId: promotion._id, userId });
  }

  static isAllowedToBookLots({ promotionLotId, userId }) {
    const { promotion } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1 },
    });

    this.checkPermissions({
      promotionId: promotion._id,
      userId,
      checkingFunction: isAllowedToBookPromotionLots,
      errorMessage: 'Vous ne pouvez pas réserver des lots dans cette promotion',
    });
  }

  static isAllowedToBookLotToCustomer({ promotionLotId, loanId, userId }) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const { promotion } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1, users: { _id: 1 } },
    });

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      ...proLoans(),
    });

    const customerOwningGroup = getPromotionCustomerOwningGroup({
      customerId: loan.user._id,
      userId,
      promotionId: promotion._id,
    });

    const currentUser = UserService.fetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    if (
      !isAllowedToBookPromotionLotToCustomer({
        promotion,
        currentUser,
        customerOwningGroup,
      })
    ) {
      Security.handleUnauthorized('Vous ne pouvez pas réserver de lot à ce client');
    }
  }

  static isAllowedToCancelLotBooking({ promotionLotId, userId }) {
    const { attributedTo } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      attributedTo: { _id: 1 },
    });

    this.isAllowedToBookLotToCustomer({
      promotionLotId,
      loanId: attributedTo._id,
      userId,
    });
  }

  static isAllowedToSellLots({ promotionLotId, userId }) {
    const { promotion } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1 },
    });

    this.checkPermissions({
      promotionId: promotion._id,
      userId,
      checkingFunction: isAllowedToSellPromotionLots,
      errorMessage: 'Vous ne pouvez pas vendre des lots dans cette promotion',
    });
  }

  static isAllowedToSellLotToCustomer({ promotionLotId, userId }) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const { promotion } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1, users: { _id: 1 } },
    });

    const { attributedTo } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      attributedTo: { _id: 1 },
    });

    const loan = LoanService.fetchOne({
      $filters: { _id: attributedTo._id },
      ...proLoans(),
    });

    const customerOwningGroup = getPromotionCustomerOwningGroup({
      customerId: loan.user._id,
      userId,
      promotionId: promotion._id,
    });

    const currentUser = UserService.fetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    if (
      !isAllowedToSellPromotionLotToCustomer({
        promotion,
        currentUser,
        customerOwningGroup,
      })
    ) {
      Security.handleUnauthorized('Vous ne pouvez pas vendre de lot à ce client');
    }
  }

  static isAllowedToModifyAdditionalLot({ lotId, userId }) {
    const { promotions } = LotService.fetchOne({
      $filters: { _id: lotId },
      promotions: { _id: 1 },
    });

    this.isAllowedToModifyLots({ promotionId: promotions._id, userId });
  }

  static isAllowedToRemoveAdditionalLot({ lotId, userId }) {
    const { promotions } = LotService.fetchOne({
      $filters: { _id: lotId },
      promotions: { _id: 1 },
    });

    this.isAllowedToRemoveLots({ promotionId: promotions._id, userId });
  }
}

export default PromotionSecurity;
