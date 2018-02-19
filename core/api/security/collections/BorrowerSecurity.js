import Security from '../Security';
import { Borrowers } from '../..';

class BorrowerSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(loanId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const loan = Borrowers.findOne(loanId);
    Security.checkOwnership(loan);
  }

  static isAllowedToDelete() {
    Security.checkCurrentUserIsAdmin();
  }
}

export default BorrowerSecurity;
