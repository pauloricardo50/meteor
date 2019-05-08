import { LOAN_STATUS } from 'core/api/loans/loanConstants';
import Security from '../Security';
import LoanService from '../../loans/server/LoanService';

class LoanSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(loanId, userId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      userId: 1,
      userLinks: 1,
    });
    if (loan.userId) {
      Security.checkOwnership(loan, userId);
    } else {
      this.checkAnonymousLoan({ loanId });
    }
  }

  static isAllowedToDelete() {
    Security.checkCurrentUserIsAdmin();
  }

  static checkAnonymousLoan({ loanId }) {
    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      anonymous: 1,
      status: 1,
    });

    if (
      !loan
      || loan.anonymous !== true
      || loan.status === LOAN_STATUS.UNSUCCESSFUL
      || loan.userId
    ) {
      Security.handleUnauthorized();
    }
  }
}

export default LoanSecurity;
