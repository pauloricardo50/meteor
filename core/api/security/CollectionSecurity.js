import Security from './Security';
import { Loans } from '..';

class LoanSecurity extends Security {
    static isAllowedToUpdate(loanId) {
        if (this.currentUserIsAdmin()) {
            return;
        }

        const loan = Loans.findOne(loanId);
        this.checkOwnership(loan);
    }
}

export { LoanSecurity };
