import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Loans from '../../loans/loans';
import Borrowers from '../../borrowers/borrowers';

Meteor.methods({
    setUserToLoan: ({ loanId }) => {
        check(loanId, String);

        if (!Meteor.userId()) {
            throw new Meteor.Error('not authorized');
        }

        const loan = Loans.findOne(loanId);
        const { borrowers } = loan;

        Loans.update(loanId, { $set: { userId: Meteor.userId() } });
        borrowers.forEach(borrowerId => {
            Borrowers.update(borrowerId, { $set: { userId: Meteor.userId() } });
        });

        return true;
    },
    addBorrower({ loanId }) {
        // TODO: Secure this
        const loan = Loans.findOne(loanId);

        // A loan can't have more than 2 borrowers at the moment
        if (loan.borrowerIds.length >= 2) {
            return false;
        }

        const newBorrowerId = Borrowers.insert({ userId: Meteor.userId() });

        return Loans.update(loanId, {
            $push: { borrowerIds: newBorrowerId }
        });
    },
    removeBorrower({ loanId, borrowerId }) {
        // TODO: Secure this
        const loan = Loans.findOne(loanId);

        // A loan has to have at least 1 borrower
        if (loan.borrowerIds.length <= 1) {
            return false;
        }

        Borrowers.remove(borrowerId);
        return Loans.update(loanId, {
            $pull: { borrowerIds: borrowerId }
        });
    }
});
