import { Meteor } from 'meteor/meteor';
import { withProps, compose } from 'recompose';

import {
  completeFakeBorrower,
  emptyFakeBorrower,
} from '../../api/borrowers/fakes';
import {
  loanStep1,
  loanStep2,
  loanStep3,
  emptyLoan,
} from '../../api/loans/fakes';
import { fakeProperty, emptyProperty } from '../../api/properties/fakes';
import {
  borrowerInsert,
  loanUpdate,
  adminLoanInsert,
  borrowerUpdate,
  propertyUpdate,
  pushLoanValue,
  migrateToLatest,
} from '../../api';
import adminLoan from '../../api/loans/queries/adminLoan';

const addLoanWithData = ({ borrowers, properties, loan: loanData, userId }) => {
  let loanId;
  let loan;
  return adminLoanInsert
    .run({ userId })
    .then((id) => {
      loanId = id;
      return new Promise((resolve, reject) => {
        adminLoan.clone({ _id: loanId }).fetchOne((err, data) => {
          if (err) {
            reject(err);
          }
          loan = data;
          resolve(data);
        });
      });
    })
    .then(() => loanUpdate.run({ loanId, object: loanData }))
    .then(() => {
      const [borrowerId1] = loan.borrowers.map(({ _id }) => _id);
      return borrowerUpdate.run({
        borrowerId: borrowerId1,
        object: borrowers[0],
      });
    })
    .then(() => {
      if (borrowers.length > 1) {
        return borrowerInsert.run({ borrower: borrowers[1] }).then(borrowerId =>
          pushLoanValue.run({
            loanId,
            object: { borrowerIds: borrowerId },
          }));
      }
    })
    .then(() =>
      propertyUpdate.run({
        propertyId: loan.properties[0]._id,
        object: properties[0],
      }));
};

const addEmptyStep1Loan = userId => twoBorrowers =>
  addLoanWithData({
    borrowers: twoBorrowers
      ? [emptyFakeBorrower, emptyFakeBorrower]
      : [emptyFakeBorrower],
    properties: [emptyProperty],
    loan: emptyLoan,
    userId,
  });

const addStep1Loan = userId => twoBorrowers =>
  addLoanWithData({
    borrowers: twoBorrowers
      ? [completeFakeBorrower, completeFakeBorrower]
      : [completeFakeBorrower],
    properties: [fakeProperty],
    loan: loanStep1,
    userId,
  });

const addStep2Loan = userId => twoBorrowers =>
  addLoanWithData({
    borrowers: twoBorrowers
      ? [completeFakeBorrower, completeFakeBorrower]
      : [completeFakeBorrower],
    properties: [fakeProperty],
    loan: loanStep2,
    userId,
  });

const addStep3Loan = userId => (twoBorrowers, completeFiles = true) =>
  addLoanWithData({
    borrowers: twoBorrowers
      ? [completeFakeBorrower, completeFakeBorrower]
      : [completeFakeBorrower],
    properties: [fakeProperty],
    loan: loanStep3(completeFiles),
    userId,
  });

const DevPageContainer = compose(withProps(({ currentUser: { _id: userId } }) => ({
  addEmptyStep1Loan: addEmptyStep1Loan(userId),
  addStep1Loan: addStep1Loan(userId),
  addStep2Loan: addStep2Loan(userId),
  addStep3Loan: addStep3Loan(userId),
  purgeAndGenerateDatabase: (currentUserId, currentUserEmail) => {
    Meteor.call('purgeDatabase', currentUserId, (err) => {
      if (err) {
        alert(err.reason);
      } else {
        Meteor.call('generateTestData', currentUserEmail);
      }
    });
  },
  migrateToLatest: () => migrateToLatest.run(),
})));

export default DevPageContainer;
