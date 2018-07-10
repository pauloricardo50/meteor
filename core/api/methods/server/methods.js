import { Meteor } from 'meteor/meteor';
import { SecurityService, Loans, Borrowers, Properties } from '../..';
import {
  getMixpanelAuthorization,
  getServerTime,
  downloadPDF,
  addBorrower,
  setUserToLoan,
  removeBorrower,
  submitContactForm,
} from '../methodDefinitions';

getMixpanelAuthorization.setHandler(() => {
  SecurityService.checkCurrentUserIsAdmin();
  const btoa = require('btoa');

  const API_KEY = Meteor.settings.MIXPANEL_API_KEY;
  const API_SECRET = Meteor.settings.MIXPANEL_API_SECRET;

  return `Basic ${btoa(`${API_SECRET}:${API_KEY}`)}`;
});

getServerTime.setHandler(() => new Date());

downloadPDF.setHandler(() => {
  // TODO
});

addBorrower.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  const loan = Loans.findOne(loanId);

  // A loan can't have more than 2 borrowers at the moment
  if (loan.borrowerIds.length >= 2) {
    return false;
  }

  const newBorrowerId = Borrowers.smartInsert({ userId: Meteor.userId() });

  return Loans.update(loanId, { $push: { borrowerIds: newBorrowerId } });
});

setUserToLoan.setHandler((context, { loanId }) => {
  SecurityService.checkLoggedIn();
  const loan = Loans.findOne(loanId);
  const { borrowerIds, propertyId } = loan;

  if (loan.userId) {
    throw new Meteor.Error('loan-already-owned');
  }

  const currentUserId = Meteor.userId();

  Loans.update(loanId, { $set: { userId: currentUserId } });
  borrowerIds.forEach((borrowerId) => {
    Borrowers.update(borrowerId, { $set: { userId: currentUserId } });
  });
  Properties.update(propertyId, { $set: { userId: currentUserId } });
});

removeBorrower.setHandler((context, { loanId, borrowerId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);

  const loan = Loans.findOne(loanId);

  // A loan has to have at least 1 borrower
  if (loan.borrowerIds.length <= 1) {
    return false;
  }

  Borrowers.remove(borrowerId);
  return Loans.update(loanId, { $pull: { borrowerIds: borrowerId } });
});

// This method needs to exist as its being listened to in EmailListeners
submitContactForm.setHandler(() => null);
