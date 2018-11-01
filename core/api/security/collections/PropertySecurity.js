import Security from '../Security';
import { Properties, Promotions } from '../..';
import { ROLES } from '../../users/userConstants';
import PromotionSecurity from './PromotionSecurity';

class PropertySecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static checkBelongsToPromotion(propertyId) {
    const promotion = Promotions.findOne({ 'propertyLinks._id': propertyId });
    if (promotion) {
      PromotionSecurity.isAllowedToUpdate(promotion._id);
      return;
    }

    Security.handleUnauthorized('Not allowed to modify promotion property');
  }

  static isAllowedToUpdate(propertyId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    if (Security.currentUserHasRole(ROLES.PRO)) {
      // Check if this property belongs to one of his promotions
      this.checkBelongsToPromotion(propertyId);
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
}

export default PropertySecurity;
