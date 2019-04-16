import PromotionService from '../../promotions/server/PromotionService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import Security from '../Security';
import LoanSecurity from './LoanSecurity';
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
import {
  getPromotionCustomerOwnerType,
  makeLoanAnonymizer,
} from '../../promotions/server/promotionServerHelpers';
import { proPromotion, proUser, proLoans } from '../../fragments';
import LotService from '../../lots/server/LotService';

class PromotionSecurity {
  static checkPermissions({
    promotionId,
    userId,
    checkingFunction,
    errorMessage,
  }) {
    if (Security.isUserAdmin(userId)) {
      return;
    }
    const promotion = PromotionService.safeFetchOne({
      $filters: { _id: promotionId },
      ...proPromotion(),
    });
    const currentUser = UserService.safeFetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    if (!checkingFunction({ promotion, currentUser })) {
      Security.handleUnauthorized(errorMessage || 'Checking permissions');
    }
  }

  static getPromotionIdFromPromotionLot = ({ promotionLotId }) => {
    const { promotion = {} } = PromotionLotService.safeFetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1 },
    });

    return promotion._id;
  };

  static hasAccessToPromotion({ promotionId, userId }) {
    try {
      this.isAllowedToView({ promotionId, userId });
      return;
    } catch (error) {
      const hasPromotion = UserService.hasPromotion({ promotionId, userId });

      if (!hasPromotion) {
        Security.handleUnauthorized("Vous n'avez pas accès à cette promotion");
      }
    }
  }

  static hasAccessToPromotionLot({ promotionLotId, userId }) {
    this.hasAccessToPromotion({
      promotionId: this.getPromotionIdFromPromotionLot({ promotionLotId }),
      userId,
    });
  }

  static hasAccessToPromotionOption({ promotionOptionId, userId }) {
    if (Security.isUserAdmin(userId)) {
      return;
    }

    const { loan, promotionLots } = PromotionOptionService.safeFetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1, userId: 1 },
      promotionLots: { _id: 1 },
    });

    if (Security.hasRole(userId, ROLES.PRO)) {
      this.hasAccessToPromotionLot(promotionLots[0]._id, userId);
    } else {
      LoanSecurity.isAllowedToUpdate(loan && loan._id);
    }
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
    const { promotion } = PromotionLotService.safeFetchOne({
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
    if (Security.isUserAdmin(userId)) {
      return;
    }

    const promotion = PromotionService.safeFetchOne({
      $filters: { _id: promotionId },
      ...proPromotion(),
    });
    const currentUser = UserService.safeFetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    const loan = LoanService.safeFetchOne({
      $filters: { _id: loanId },
      ...proLoans(),
    });

    const customerOwnerType = getPromotionCustomerOwnerType({
      customerId: loan.user._id,
      userId,
      promotionId,
    });

    if (
      !isAllowedToRemoveCustomerFromPromotion({
        promotion,
        currentUser,
        customerOwnerType,
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
    if (Security.isUserAdmin(userId)) {
      return;
    }

    this.isAllowedToView({
      promotionId: this.getPromotionIdFromPromotionLot({ promotionLotId }),
      userId,
    });
  }

  static isAllowedToViewPromotionOption({ promotionOptionId, userId }) {
    if (Security.isUserAdmin(userId)) {
      return;
    }

    const { promotionLots = [] } = PromotionOptionService.safeFetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: { _id: 1 },
    });

    promotionLots.forEach(({ _id: promotionLotId }) => {
      this.isAllowedToViewPromotionLot({ promotionLotId, userId });
    });
  }

  static isAllowedToModifyPromotionLot({ promotionLotId, userId }) {
    this.isAllowedToModifyLots({
      promotionId: this.getPromotionIdFromPromotionLot({ promotionLotId }),
      userId,
    });
  }

  static isAllowedToRemovePromotionLot({ promotionLotId, userId }) {
    this.isAllowedToRemoveLots({
      promotionId: this.getPromotionIdFromPromotionLot({ promotionLotId }),
      userId,
    });
  }

  static isAllowedToBookLots({ promotionLotId, userId }) {
    this.checkPermissions({
      promotionId: this.getPromotionIdFromPromotionLot({ promotionLotId }),
      userId,
      checkingFunction: isAllowedToBookPromotionLots,
      errorMessage: 'Vous ne pouvez pas réserver des lots dans cette promotion',
    });
  }

  static isAllowedToBookLotToCustomer({ promotionLotId, loanId, userId }) {
    if (Security.isUserAdmin(userId)) {
      return;
    }

    const { promotion } = PromotionLotService.safeFetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1, users: { _id: 1 } },
    });

    const loan = LoanService.safeFetchOne({
      $filters: { _id: loanId },
      ...proLoans(),
    });

    const customerOwnerType = getPromotionCustomerOwnerType({
      customerId: loan.user._id,
      userId,
      promotionId: promotion._id,
    });

    const currentUser = UserService.safeFetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    if (
      !isAllowedToBookPromotionLotToCustomer({
        promotion,
        currentUser,
        customerOwnerType,
      })
    ) {
      Security.handleUnauthorized('Vous ne pouvez pas réserver de lot à ce client');
    }
  }

  static isAllowedToCancelLotBooking({ promotionLotId, userId }) {
    const { attributedTo } = PromotionLotService.safeFetchOne({
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
    this.checkPermissions({
      promotionId: this.getPromotionIdFromPromotionLot({ promotionLotId }),
      userId,
      checkingFunction: isAllowedToSellPromotionLots,
      errorMessage: 'Vous ne pouvez pas vendre des lots dans cette promotion',
    });
  }

  static isAllowedToSellLotToCustomer({ promotionLotId, userId }) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const { promotion, attributedTo } = PromotionLotService.safeFetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1, users: { _id: 1 } },
      attributedTo: { _id: 1 },
    });

    const loan = LoanService.safeFetchOne({
      $filters: { _id: attributedTo._id },
      ...proLoans(),
    });

    const customerOwnerType = getPromotionCustomerOwnerType({
      customerId: loan.user._id,
      userId,
      promotionId: promotion._id,
    });

    const currentUser = UserService.safeFetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    if (
      !isAllowedToSellPromotionLotToCustomer({
        promotion,
        currentUser,
        customerOwnerType,
      })
    ) {
      Security.handleUnauthorized('Vous ne pouvez pas vendre de lot à ce client');
    }
  }

  static isAllowedToModifyAdditionalLot({ lotId, userId }) {
    const { promotions } = LotService.safeFetchOne({
      $filters: { _id: lotId },
      promotions: { _id: 1 },
    });

    this.isAllowedToModifyLots({ promotionId: promotions._id, userId });
  }

  static isAllowedToRemoveAdditionalLot({ lotId, userId }) {
    const { promotions } = LotService.safeFetchOne({
      $filters: { _id: lotId },
      promotions: { _id: 1 },
    });

    this.isAllowedToRemoveLots({ promotionId: promotions._id, userId });
  }

  static isAllowedToSeePromotionCustomer({ userId, promotionId, loanId }) {
    if (Security.isUserAdmin(userId)) {
      return;
    }

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      _id: 1,
      user: { _id: 1 },
    });
    const anonymizer = makeLoanAnonymizer({ userId, promotionId });
    if (anonymizer(loan).anonymous) {
      Security.handleUnauthorized("Vous n'avez pas accès à ce client");
    }
  }
}

export default PromotionSecurity;
