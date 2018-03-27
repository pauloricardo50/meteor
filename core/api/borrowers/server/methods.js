import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import BorrowerService from '../BorrowerService';
import {
  borrowerInsert,
  borrowerUpdate,
  borrowerDelete,
  pushBorrowerValue,
  popBorrowerValue,
} from '../methodDefinitions';

borrowerInsert.setHandler((context, { borrower, userId }) => {
  let finalUserId;

  if (userId) {
    SecurityService.checkCurrentUserIsAdmin();
    finalUserId = userId;
  } else if (userId === undefined) {
    SecurityService.checkLoggedIn();
    finalUserId = Meteor.userId();
  } else if (userId === null) {
    SecurityService.checkLoggedOut();
    finalUserId = null;
  }

  return BorrowerService.insert({ borrower, userId: finalUserId });
});

borrowerUpdate.setHandler((context, { borrowerId, object }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.update({ borrowerId, object });
});

borrowerDelete.setHandler((context, { borrowerId }) => {
  SecurityService.borrowers.isAllowedToDelete(borrowerId);
  return BorrowerService.remove({ borrowerId });
});

pushBorrowerValue.setHandler((context, { borrowerId, object }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.pushValue(object);
});

popBorrowerValue.setHandler((context, { borrowerId, object }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.pushValue(object);
});
