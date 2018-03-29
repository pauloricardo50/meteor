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
  if (userId === undefined) {
    SecurityService.checkLoggedIn();
    userId = Meteor.userId();
  }

  return BorrowerService.insert({ borrower, userId });
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
