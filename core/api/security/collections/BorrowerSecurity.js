import Security from '../Security';
import { Borrowers } from '../..';

class BorrowerSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(borrowerId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const borrower = Borrowers.findOne(borrowerId);
    Security.checkOwnership(borrower);
  }

  static isAllowedToDelete(borrowerId) {
    this.isAllowedToUpdate(borrowerId);
  }
}

export default BorrowerSecurity;
