import Security from '../Security';
import { Properties, Promotions } from '../..';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import PromotionSecurity from './PromotionSecurity';
import PropertyService from '../../properties/server/PropertyService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import {
  isAllowedToViewProProperty,
  isAllowedToModifyProProperty,
  isAllowedToInviteCustomersToProProperty,
  isAllowedToInviteProUsersToProProperty,
  isAllowedToRemoveCustomerFromProProperty,
  isAllowedToBookProProperty,
  isAllowedToBookProPropertyToCustomer,
  isAllowedToSellProProperty,
  isAllowedToSellProPropertyToCustomer,
  isAllowedToManageProPropertyPermissions,
} from '../clientSecurityHelpers';
import { proUser, fullProperty } from '../../fragments';
import LoanService from '../../loans/server/LoanService';
import { getProPropertyCustomerOwnerType } from '../../properties/server/propertyServerHelpers';

class PropertySecurity {
  static checkPermissions({
    propertyId,
    userId,
    checkingFunction,
    errorMessage,
  }) {
    if (Security.currentUserIsAdmin()) {
      return;
    }
    const property = PropertyService.fetchOne({
      $filters: { _id: propertyId },
      ...fullProperty(),
    });
    const currentUser = UserService.fetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    if (!checkingFunction({ property, currentUser })) {
      Security.handleUnauthorized(errorMessage || 'Checking permissions');
    }
  }

  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isPromotionLot(propertyId) {
    const { category } = PropertyService.fetchOne({
      $filters: { _id: propertyId },
      category: 1,
    });

    return category === PROPERTY_CATEGORY.PROMOTION;
  }

  static checkBelongsToPromotion(propertyId, userId) {
    const promotion = Promotions.findOne({ 'propertyLinks._id': propertyId });
    if (promotion) {
      PromotionSecurity.isAllowedToUpdate(promotion._id, userId);
      return;
    }

    Security.handleUnauthorized('Not allowed to modify promotion property');
  }

  static isProUserAllowedToUpdate({ propertyId, userId }) {
    const { category } = Properties.findOne(propertyId);
    if (category === PROPERTY_CATEGORY.PRO) {
      this.checkPermissions({
        propertyId,
        userId,
        checkingFunction: isAllowedToModifyProProperty,
        errorMessage: 'Vous ne pouvez pas modifier ce bien immobilier',
      });
    } else if (category === PROPERTY_CATEGORY.PROMOTION) {
      this.checkBelongsToPromotion(propertyId, userId);
    } else {
      this.handleUnauthorized('Vous ne pouvez pas modifier ce bien immobilier');
    }
  }

  static isAllowedToUpdate(propertyId, userId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    if (Security.currentUserHasRole(ROLES.PRO)) {
      this.isProUserAllowedToUpdate({ propertyId, userId });
    } else {
      const property = Properties.findOne(propertyId);
      Security.checkOwnership(property);
    }
  }

  static isAllowedToDelete(propertyId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const property = Properties.findOne(propertyId);
    Security.checkOwnership(property);
  }

  static hasAccessToProperty({ propertyId, userId }) {
    try {
      this.isAllowedToView({ propertyId, userId });
      return;
    } catch (error) {
      const hasProperty = UserService.hasProperty({ userId, propertyId });

      if (!hasProperty) {
        Security.handleUnauthorized("Vous n'avez pas accès à ce bien immobilier");
      }
    }
  }

  static isAllowedToView({ userId, propertyId }) {
    this.checkPermissions({
      propertyId,
      userId,
      checkingFunction: isAllowedToViewProProperty,
      errorMessage: "Vous n'avez pas accès à ce bien immobilier",
    });
  }

  static isAllowedToManageDocuments({ userId, propertyId }) {
    this.checkPermissions({
      propertyId,
      userId,
      checkingFunction: isAllowedToModifyProProperty,
      errorMessage:
        'Vous ne pouvez pas gérer les documents de ce bien immobilier',
    });
  }

  static isAllowedToInviteCustomers({ userId, propertyId }) {
    this.checkPermissions({
      propertyId,
      userId,
      checkingFunction: isAllowedToInviteCustomersToProProperty,
      errorMessage:
        'Vous ne pouvez pas inviter de clients sur ce bien immobilier',
    });
  }

  static isAllowedToInviteProUsers({ userId, propertyId }) {
    this.checkPermissions({
      propertyId,
      userId,
      checkingFunction: isAllowedToInviteProUsersToProProperty,
      errorMessage:
        'Vous ne pouvez pas inviter de tiers sur ce bien immobilier',
    });
  }

  static isAllowedToRemoveCustomer({ userId, propertyId, loanId }) {
    if (Security.currentUserIsAdmin()) {
      return true;
    }

    const property = PropertyService.fetchOne({
      $filters: { _id: propertyId },
      ...fullProperty(),
    });

    const currentUser = UserService.fetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      user: { _id: 1 },
    });

    const customerOwnerType = getProPropertyCustomerOwnerType({
      customerId: loan.user._id,
      userId,
      propertyId,
    });

    if (
      !isAllowedToRemoveCustomerFromProProperty({
        property,
        currentUser,
        customerOwnerType,
      })
    ) {
      Security.handleUnauthorized('Vous ne pouvez pas supprimer ce client de ce bien immobilier');
    }
  }

  static isAllowedToBook({ userId, propertyId }) {
    this.checkPermissions({
      propertyId,
      userId,
      checkingFunction: isAllowedToBookProProperty,
      errorMessage: 'Vous ne pouvez pas réserver ce bien immobilier',
    });
  }

  static isAllowedToBookToCustomer({ propertyId, loanId, userId }) {
    if (Security.currentUserIsAdmin()) {
      return true;
    }

    const property = PropertyService.fetchOne({
      $filters: { _id: propertyId },
      ...fullProperty(),
    });

    const currentUser = UserService.fetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      user: { _id: 1 },
    });

    const customerOwnerType = getProPropertyCustomerOwnerType({
      customerId: loan.user._id,
      userId,
      propertyId,
    });

    if (
      !isAllowedToBookProPropertyToCustomer({
        property,
        currentUser,
        customerOwnerType,
      })
    ) {
      this.handleUnauthorized('Vous ne pouvez pas réserver ce bien immobilier à ce client');
    }
  }

  static isAllowedToCancelBooking({ propertyId, loanId, userId }) {
    // TODO
  }

  static isAllowedToSell({ propertyId, userId }) {
    this.checkPermissions({
      propertyId,
      userId,
      checkingFunction: isAllowedToSellProProperty,
      errorMessage: 'Vous ne pouvez pas vendre ce bien immobilier',
    });
  }

  static isAllowedToSellToCustomer({ propertyId, loanId, userId }) {
    if (Security.currentUserIsAdmin()) {
      return true;
    }

    const property = PropertyService.fetchOne({
      $filters: { _id: propertyId },
      ...fullProperty(),
    });

    const currentUser = UserService.fetchOne({
      $filters: { _id: userId },
      ...proUser(),
    });

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      user: { _id: 1 },
    });

    const customerOwnerType = getProPropertyCustomerOwnerType({
      customerId: loan.user._id,
      userId,
      propertyId,
    });

    if (
      !isAllowedToSellProPropertyToCustomer({
        property,
        currentUser,
        customerOwnerType,
      })
    ) {
      this.handleUnauthorized('Vous ne pouvez pas vendre ce bien immobilier à ce client');
    }
  }

  static isAllowedToManagePermissions({ propertyId, userId }) {
    this.checkPermissions({
      propertyId,
      userId,
      checkingFunction: isAllowedToManageProPropertyPermissions,
      errorMessage:
        'Vous ne pouvez pas gérer les permissions sur ce bien immobilier',
    });
  }
}

export default PropertySecurity;
