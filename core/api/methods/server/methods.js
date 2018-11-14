import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SecurityService } from '../..';
import LoanService from '../../loans/LoanService';
import BorrowerService from '../../borrowers/BorrowerService';
import PropertyService from '../../properties/PropertyService';
import {
  getMixpanelAuthorization,
  getServerTime,
  downloadPDF,
  addBorrower,
  setUserToLoan,
  removeBorrower,
  submitContactForm,
  addUserToDoc,
  throwDevError,
  setAdditionalDoc,
} from '../methodDefinitions';
import { BORROWERS_COLLECTION } from '../../borrowers/borrowerConstants';
import { PROPERTIES_COLLECTION } from '../../properties/propertyConstants';
import { LOANS_COLLECTION } from '../../loans/loanConstants';

getMixpanelAuthorization.setHandler(() => {
  SecurityService.checkCurrentUserIsAdmin();
  const btoa = require('btoa');
  const { API_KEY, API_SECRET } = Meteor.settings.mixpanel;

  return `Basic ${btoa(`${API_SECRET}:${API_KEY}`)}`;
});

getServerTime.setHandler(() => new Date());

downloadPDF.setHandler(() => {
  // TODO
});

addBorrower.setHandler((context, { loanId, borrower }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  const loan = LoanService.getLoanById(loanId);

  // A loan can't have more than 2 borrowers at the moment
  if (loan.borrowerIds.length >= 2) {
    return false;
  }

  const newBorrowerId = BorrowerService.insert({
    borrower,
    userId: Meteor.userId(),
  });

  return LoanService.pushValue({
    loanId,
    object: { borrowerIds: newBorrowerId },
  });
});

setUserToLoan.setHandler((context, { loanId }) => {
  SecurityService.checkLoggedIn();
  const loan = LoanService.getLoanById(loanId);
  const { borrowerIds, propertyId } = loan;

  if (loan.userId) {
    throw new Meteor.Error('loan-already-owned');
  }

  const currentUserId = Meteor.userId();

  LoanService.update({ loanId, object: { userId: currentUserId } });
  borrowerIds.forEach((borrowerId) => {
    BorrowerService.update({ borrowerId, object: { userId: currentUserId } });
  });
  PropertyService.update({ propertyId, object: { userId: currentUserId } });
});

removeBorrower.setHandler((context, { loanId, borrowerId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);

  const loan = LoanService.getLoanById(loanId);

  // A loan has to have at least 1 borrower
  if (loan.borrowerIds.length <= 1) {
    return false;
  }

  BorrowerService.remove({ borrowerId });

  return LoanService.pullValue({ loanId, object: { borrowerIds: borrowerId } });
});

// This method needs to exist as its being listened to in EmailListeners
submitContactForm.setHandler(() => null);

addUserToDoc.setHandler(({ userId }, { docId, collection, options, userId: newUserId }) => {
  const doc = Mongo.Collection.get(collection).findOne(docId);
  try {
    SecurityService.checkUserIsAdmin(userId);
  } catch (error) {
    SecurityService.checkOwnership(doc);
  }
  Mongo.Collection.get(collection).update(docId, {
    userLinks: { $push: { _id: newUserId, ...options } },
  });
});

throwDevError.setHandler((_, { promise, promiseNoReturn }) => {
  console.log('Throwing dev error..');

  if (promise) {
    return new Promise((resolve, reject) => {
      reject(new Meteor.Error(400, 'Dev promise error!'));
    });
  }
  if (promiseNoReturn) {
    new Promise((resolve, reject) => {
      reject(new Meteor.Error(400, 'Dev promise error!'));
    });

    return;
  }

  throw new Meteor.Error(400, 'Dev error!');
});

setAdditionalDoc.setHandler((context, { collection, id, additionalDocId, requiredByAdmin, label }) => {
  SecurityService.checkCurrentUserIsAdmin();
  switch (collection) {
  case BORROWERS_COLLECTION:
    return BorrowerService.setAdditionalDoc({
      id,
      additionalDocId,
      requiredByAdmin,
      label,
    });
  case PROPERTIES_COLLECTION:
    return PropertyService.setAdditionalDoc({
      id,
      additionalDocId,
      requiredByAdmin,
      label,
    });
  case LOANS_COLLECTION:
    return LoanService.setAdditionalDoc({
      id,
      additionalDocId,
      requiredByAdmin,
      label,
    });
  default:
    throw new Meteor.Error('Unsupported collection');
  }
});
