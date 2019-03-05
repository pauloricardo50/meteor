import Security from '../Security';
import { Properties, Promotions } from '../..';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import PromotionSecurity from './PromotionSecurity';
import PropertyService from '../../properties/server/PropertyService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import { isAllowedToViewProProperty } from '../clientSecurityHelpers';
import { proUser, fullProperty } from '../../fragments';

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
    const property = PropertyService.safeFetchOne({
      $filters: { _id: propertyId },
      ...fullProperty(),
    });
    const currentUser = UserService.safeFetchOne({
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

  static isAllowedToUpdate(propertyId, userId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    if (Security.currentUserHasRole(ROLES.PRO)) {
      // Check if this property belongs to one of his promotions
      this.checkBelongsToPromotion(propertyId, userId);
      return;
    }

    const property = Properties.findOne(propertyId);
    Security.checkOwnership(property);
  }

  static isAllowedToDelete(propertyId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const property = Properties.findOne(propertyId);
    Security.checkOwnership(property);
  }

  static isAllowedToRead(propertyId, userId) {
    // TODO
    return true;
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
}

export default PropertySecurity;
