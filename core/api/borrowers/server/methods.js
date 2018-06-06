import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import BorrowerService from '../BorrowerService';
import UserService from '../../users/UserService';
import {
  borrowerInsert,
  borrowerUpdate,
  borrowerDelete,
  pushBorrowerValue,
  popBorrowerValue,
  setNewBorrowerNames,
} from '../methodDefinitions';

import { getUserNames } from '../../users/methodDefinitions';

setNewBorrowerNames.setHandler((context, { borrower, userId }) =>
  getUserNames.run({ userId }).then(({ firstName, lastName }) => {
    if (firstName) {
      borrower.firstName = firstName;
    }

    if (lastName) {
      borrower.lastName = lastName;
    }

    return borrower;
  }));

borrowerInsert.setHandler((context, { borrower, userId }) => {
  if (userId === undefined && Meteor.userId()) {
    userId = Meteor.userId();
  }

  const borrowerToInsert = this.setNewBorrowerNames({ userId, borrower });

  return BorrowerService.insert({ borrower: borrowerToInsert, userId });
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
