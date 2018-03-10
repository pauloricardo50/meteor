import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import BorrowerService from '../BorrowerService';
import {
  borrowerInsert,
  borrowerUpdate,
  borrowerDelete,
} from '../methodDefinitions';

borrowerInsert.setHandler((context, { borrower, userId }) => {
  const userIdIsDefined = userId !== undefined;
  if (userIdIsDefined) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.borrowers.isAllowedToInsert();
  }

  return BorrowerService.insert({
    borrower,
    userId: userIdIsDefined ? userId : Meteor.userId(),
  });
});

borrowerUpdate.setHandler((context, { borrowerId, borrower }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.update({ borrowerId, borrower });
});

borrowerDelete.setHandler((context, { borrowerId }) => {
  SecurityService.borrowers.isAllowedToDelete(borrowerId);
  return BorrowerService.remove({ borrowerId });
});
