import Security from '../Security';
import { Offers } from '../..';

class OfferSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(loanId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const loan = Offers.findOne(loanId);
    Security.checkOwnership(loan);
  }

  static isAllowedToDelete() {
    Security.checkCurrentUserIsAdmin();
  }
}

export default OfferSecurity;
