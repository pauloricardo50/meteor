import Security from '../Security';
import { Loans } from '../..';

class LoanSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate(loanId) {
    if (Security.currentUserIsAdmin()) {
      return;
    }

    const loan = Loans.findOne(loanId);
    Security.checkOwnership(loan);
  }
}

export default LoanSecurity;
