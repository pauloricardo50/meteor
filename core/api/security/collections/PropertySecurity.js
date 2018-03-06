import Security from '../Security';
import { Properties } from '../..';

class PropertySecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(loanId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const loan = Properties.findOne(loanId);
    Security.checkOwnership(loan);
  }

  static isAllowedToDelete() {
    Security.checkCurrentUserIsAdmin();
  }
}

export default PropertySecurity;
