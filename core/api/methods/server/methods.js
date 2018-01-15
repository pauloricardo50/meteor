import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import LoanRequests from '../../loanrequests/loanrequests';
import Borrowers from '../../borrowers/borrowers';
import { generateComponentAsPDF } from '../../../utils/generate-pdf';
import { RequestPDF, AnonymousRequestPDF } from '../../loanrequests/pdf.js';
import rateLimit from '../../../utils/rate-limit.js';

Meteor.methods({
  getServerTime: () => new Date(),
  setUserToRequest: ({ requestId }) => {
    check(requestId, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    const request = LoanRequests.findOne(requestId);
    const { borrowers } = request;

    LoanRequests.update(requestId, { $set: { userId: Meteor.userId() } });
    borrowers.forEach((borrowerId) => {
      Borrowers.update(borrowerId, { $set: { userId: Meteor.userId() } });
    });

    return true;
  },
  addBorrower({ requestId }) {
    // TODO: Secure this
    const request = LoanRequests.findOne(requestId);

    // A request can't have more than 2 borrowers at the moment
    if (request.borrowers.length >= 2) {
      return false;
    }

    const newBorrowerId = Borrowers.insert({ userId: Meteor.userId() });

    return LoanRequests.update(requestId, {
      $push: { borrowers: newBorrowerId },
    });
  },
  removeBorrower({ requestId, borrowerId }) {
    // TODO: Secure this
    const request = LoanRequests.findOne(requestId);

    // A request has to have at least 1 borrower
    if (request.borrowers.length <= 1) {
      return false;
    }

    Borrowers.remove(borrowerId);
    return LoanRequests.update(requestId, {
      $pull: { borrowers: borrowerId },
    });
  },
});

export const downloadPDF = new ValidatedMethod({
  name: 'pdf.download',
  validate({ requestId, type }) {
    check(requestId, String);
    check(type, String);
  },
  run({ requestId, type }) {
    const loanRequest = LoanRequests.findOne(requestId);
    const borrowers = Borrowers.find({ _id: { $in: loanRequest.borrowers } });
    const prefix = type === 'anonymous' ? 'Anonyme' : 'Complet';
    const fileName = `${prefix} ${loanRequest.property.address1}.pdf`;

    // If type is anonymous, request the anonymous pdf
    const component = type === 'anonymous' ? AnonymousRequestPDF : RequestPDF;

    return generateComponentAsPDF({
      component,
      props: { loanRequest, borrowers },
      fileName,
    })
      .then(result => result)
      .catch((error) => {
        throw new Meteor.Error('500', error);
      });
  },
});

rateLimit({ methods: [downloadPDF] });
