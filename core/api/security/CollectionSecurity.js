import Security from './Security';
import { Loans } from '..';

class LoanSecurity {
    static isAllowedToUpdate(loanId) {
        if (Security.currentUserIsAdmin()) {
            return;
        }

        const loan = Loans.findOne(loanId);
        Security.checkOwnership(loan);
    }
}

export { LoanSecurity };
