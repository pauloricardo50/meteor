import Security from '../Security';
import { Properties, Promotions } from '../..';
import { ROLES } from '../../users/userConstants';
import PromotionSecurity from './PromotionSecurity';
import PropertyService from '../../properties/server/PropertyService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';

class PropertySecurity {
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
}

export default PropertySecurity;
