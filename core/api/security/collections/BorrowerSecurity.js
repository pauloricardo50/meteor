import BorrowerService from 'core/api/borrowers/server/BorrowerService';
import Security from '../Security';
import { LoanSecurity } from './index';

class BorrowerSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(borrowerId, userId) {
    if (!borrowerId) {
      Security.handleUnauthorized();
    }

    if (Security.currentUserIsAdmin()) {
      return;
    }

    const borrower = BorrowerService.fetchOne({
      $filters: { _id: borrowerId },
      userId: 1,
      loans: { anonymous: 1 },
    });

    if (borrower.userId) {
      Security.checkOwnership(borrower, userId);
    } else if (borrower.loans.length === 1 && borrower.loans[0].anonymous) {
      LoanSecurity.checkAnonymousLoan(borrower.loans[0]._id);
    } else {
      Security.handleUnauthorized('borrowerUpdate not allowed');
    }
  }

  static isAllowedToDelete(borrowerId) {
    this.isAllowedToUpdate(borrowerId);
  }
}

export default BorrowerSecurity;
