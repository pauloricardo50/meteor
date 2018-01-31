import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Loans from '../../loans/loans';
import Borrowers from '../../borrowers/borrowers';
import { generateComponentAsPDF } from '../../../utils/generate-pdf';
import { LoanPDF, AnonymousLoanPDF } from '../../loans/pdf.js';
import rateLimit from '../../../utils/rate-limit.js';

Meteor.methods({
  getServerTime: () => new Date(),
  setUserToLoan: ({ loanId }) => {
    check(loanId, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    const loan = Loans.findOne(loanId);
    const { borrowers } = loan;

    Loans.update(loanId, { $set: { userId: Meteor.userId() } });
    borrowers.forEach((borrowerId) => {
      Borrowers.update(borrowerId, { $set: { userId: Meteor.userId() } });
    });

    return true;
  },
  addBorrower({ loanId }) {
    // TODO: Secure this
    const loan = Loans.findOne(loanId);

    // A loan can't have more than 2 borrowers at the moment
    if (loan.borrowers.length >= 2) {
      return false;
    }

    const newBorrowerId = Borrowers.insert({ userId: Meteor.userId() });

    return Loans.update(loanId, {
      $push: { borrowers: newBorrowerId },
    });
  },
  removeBorrower({ loanId, borrowerId }) {
    // TODO: Secure this
    const loan = Loans.findOne(loanId);

    // A loan has to have at least 1 borrower
    if (loan.borrowers.length <= 1) {
      return false;
    }

    Borrowers.remove(borrowerId);
    return Loans.update(loanId, {
      $pull: { borrowers: borrowerId },
    });
  },
});

export const downloadPDF = new ValidatedMethod({
  name: 'pdf.download',
  validate({ loanId, type }) {
    check(loanId, String);
    check(type, String);
  },
  run({ loanId, type }) {
    const loan = Loans.findOne(loanId);
    const borrowers = Borrowers.find({ _id: { $in: loan.borrowers } });
    const prefix = type === 'anonymous' ? 'Anonyme' : 'Complet';
    const fileName = `${prefix} ${loan.property.address1}.pdf`;

    // If type is anonymous, loan the anonymous pdf
    const component = type === 'anonymous' ? AnonymousLoanPDF : LoanPDF;

    return generateComponentAsPDF({
      component,
      props: { loan, borrowers },
      fileName,
    })
      .then(result => result)
      .catch((error) => {
        throw new Meteor.Error('500', error);
      });
  },
});

rateLimit({ methods: [downloadPDF] });
