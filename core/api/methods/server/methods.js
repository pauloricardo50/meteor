import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SecurityService } from '../..';
import { Services } from '../../api-server';
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
  migrateToLatest,
  updateDocument,
} from '../methodDefinitions';

import { migrate } from '../../migrations/server';

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
  const loan = LoanService.get(loanId);

  // A loan can't have more than 2 borrowers at the moment
  if (loan.borrowerIds.length >= 2) {
    throw new Meteor.Error('Vous ne pouvez pas avoir plus de 2 emprunteurs');
  }

  const newBorrowerId = BorrowerService.insert({
    borrower,
    userId: loan.userId,
  });

  return LoanService.pushValue({
    loanId,
    object: { borrowerIds: newBorrowerId },
  });
});

setUserToLoan.setHandler((context, { loanId }) => {
  SecurityService.checkLoggedIn();
  const loan = LoanService.get(loanId);
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

  const loan = LoanService.get(loanId);

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
  return Services[collection].setAdditionalDoc({
    id,
    additionalDocId,
    requiredByAdmin,
    label,
  });
});

migrateToLatest.setHandler(({ userId }) => {
  SecurityService.checkCurrentUserIsDev();
  migrate();
});

updateDocument.setHandler(({ userId }, { collection, docId, object }) => {
  const service = Services[collection];
  const doc = service.findOne(docId);
  try {
    SecurityService.checkUserIsAdmin(userId);
  } catch (error) {
    SecurityService.checkOwnership(doc);
  }

  return service._update({ id: docId, object });
});
