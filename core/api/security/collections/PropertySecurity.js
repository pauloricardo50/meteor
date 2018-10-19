import Security from '../Security';
import { Properties } from '../..';

class PropertySecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(propertyId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const property = Properties.findOne(propertyId);
    Security.checkOwnership(property);
  }

  static isAllowedToDelete() {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const property = Properties.findOne(propertyId);
    Security.checkOwnership(property);
  }
}

export default PropertySecurity;
