import { LOAN_STATUS } from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';
import Security from '../Security';

class LoanSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(loanId, userId) {
    if (!loanId) {
      Security.handleUnauthorized();
    }

    if (Security.currentUserIsAdmin()) {
      return;
    }

    const loan = LoanService.get(loanId, { userId: 1, userLinks: 1 });
    if (loan.userId) {
      Security.checkOwnership(loan, userId);
    } else {
      this.checkAnonymousLoan(loanId);
    }
  }

  static isAllowedToDelete() {
    Security.checkCurrentUserIsAdmin();
  }

  static checkAnonymousLoan(loanId) {
    const loan = LoanService.get(loanId, { anonymous: 1, status: 1 });

    if (
      !loan ||
      loan.anonymous !== true ||
      loan.status === LOAN_STATUS.UNSUCCESSFUL ||
      loan.userId
    ) {
      Security.handleUnauthorized();
    }
  }
}

export default LoanSecurity;
