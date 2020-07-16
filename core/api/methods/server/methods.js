import { Meteor } from 'meteor/meteor';

import BorrowerService from '../../borrowers/server/BorrowerService';
import generator from '../../factories/server';
import { LOANS_COLLECTION } from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';
import {
  getControl,
  migrate,
  migrateBack,
  migrateToVersion,
  unlockControl,
} from '../../migrations/server';
import { cleanAllData } from '../../migrations/server/dataCleaning';
import OrganisationService from '../../organisations/server/OrganisationService';
import SecurityService from '../../security';
import { Services } from '../../server';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import {
  addBorrower,
  cleanDatabase,
  generateScenario,
  getMigrationControl,
  getMixpanelAuthorization,
  migrateTo,
  migrateToLatest,
  referralExists,
  removeAdditionalDoc,
  removeBorrower,
  revertLastMigration,
  setAdditionalDoc,
  submitContactForm,
  throwDevError,
  unlockMigrationControl,
  updateDocument,
  updateDocumentUnset,
} from '../methodDefinitions';

getMixpanelAuthorization.setHandler(() => {
  SecurityService.checkCurrentUserIsAdmin();
  const btoa = require('btoa');
  const { API_KEY, API_SECRET } = Meteor.settings.mixpanel;

  return `Basic ${btoa(`${API_SECRET}:${API_KEY}`)}`;
});

addBorrower.setHandler((context, { loanId, borrower }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  const loan = LoanService.get(loanId, { userId: 1, borrowerIds: 1 });

  // A loan can't have more than 2 borrowers at the moment
  if (loan.borrowerIds.length >= 2) {
    throw new Meteor.Error('Vous ne pouvez pas avoir plus de 2 emprunteurs');
  }

  return BorrowerService.insert({
    borrower,
    userId: loan.userId,
    loanId,
  });
});

removeBorrower.setHandler((context, { loanId, borrowerId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);

  const loan = LoanService.get(loanId, { borrowerIds: 1 });

  // A loan has to have at least 1 borrower
  if (loan.borrowerIds.length <= 1) {
    return false;
  }

  BorrowerService.remove({ borrowerId });

  return LoanService.pullValue({ loanId, object: { borrowerIds: borrowerId } });
});

// This method needs to exist as its being listened to in EmailListeners
submitContactForm.setHandler(() => null);

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

setAdditionalDoc.setHandler((context, { collection, ...rest }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return Services[collection].setAdditionalDoc(rest);
});

removeAdditionalDoc.setHandler((context, { collection, ...rest }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return Services[collection].removeAdditionalDoc(rest);
});

migrateToLatest.setHandler(({ userId }) => {
  SecurityService.checkCurrentUserIsDev();
  migrate();
});

updateDocument.setHandler(({ userId }, { collection, docId, object }) => {
  const service = Services[collection];
  try {
    SecurityService.checkUserIsAdmin(userId);
  } catch (error) {
    if (collection === LOANS_COLLECTION) {
      SecurityService.loans.isAllowedToUpdate(docId);
    } else {
      const doc = service.get(docId, { userId: 1, userLinks: 1 });
      SecurityService.checkOwnership(doc);
    }
  }

  return service._update({ id: docId, object });
});

updateDocumentUnset.setHandler(({ userId }, { collection, docId, object }) => {
  const service = Services[collection];
  SecurityService.checkUserIsDev(userId);

  return service._update({ id: docId, object, operator: '$unset' });
});

generateScenario.setHandler(({ userId }, { scenario }) => {
  if (!Meteor.isTest) {
    SecurityService.checkUserIsAdmin(userId);
  }

  return generator(scenario);
});

referralExists.setHandler((context, params) => {
  const { refId } = params;
  const referralUser = UserService.get(
    { _id: refId, 'roles._id': ROLES.PRO },
    { _id: 1 },
  );
  const referralOrg = OrganisationService.get(refId, { _id: 1 });

  return !!referralUser || !!referralOrg;
});

cleanDatabase.setHandler(({ userId }) => {
  SecurityService.checkUserIsDev(userId);
  return cleanAllData();
});

revertLastMigration.setHandler(() => {
  SecurityService.checkCurrentUserIsDev();
  migrateBack();
});

getMigrationControl.setHandler(() => {
  SecurityService.checkCurrentUserIsDev();
  return getControl();
});

migrateTo.setHandler((context, { version }) => {
  SecurityService.checkCurrentUserIsDev();
  migrateToVersion(version);
});

unlockMigrationControl.setHandler(() => {
  SecurityService.checkCurrentUserIsDev();
  unlockControl();
});
