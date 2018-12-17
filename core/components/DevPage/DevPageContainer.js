import { Meteor } from 'meteor/meteor';
import { withProps, compose } from 'recompose';

import {
  completeFakeBorrower,
  emptyFakeBorrower,
} from '../../api/borrowers/fakes';
import { loanStep1, emptyLoan } from '../../api/loans/fakes';
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
import { PURCHASE_TYPE } from '../../api/constants';

const addOfferPromise = loanId =>
  new Promise((resolve, reject) =>
    Meteor.call('createFakeOffer', { loanId }, (err, result) =>
      (err ? reject(err) : resolve(result))));

const addLoanWithData = ({
  borrowers,
  properties,
  loan: loanData,
  userId,
  addOffers,
}) => {
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
      }))
    .then(() => {
      if (addOffers) {
        return Promise.all([
          addOfferPromise(loanId),
          addOfferPromise(loanId),
          addOfferPromise(loanId),
          addOfferPromise(loanId),
          addOfferPromise(loanId),
        ]);
      }
    });
};

const addEmptyLoan = userId => (twoBorrowers, addOffers, isRefinancing) =>
  addLoanWithData({
    borrowers: twoBorrowers
      ? [emptyFakeBorrower, emptyFakeBorrower]
      : [emptyFakeBorrower],
    properties: [emptyProperty],
    loan: {
      ...emptyLoan,
      purchaseType: isRefinancing
        ? PURCHASE_TYPE.REFINANCING
        : PURCHASE_TYPE.ACQUISITION,
    },
    userId,
    addOffers,
  });

const addLoanWithSomeData = userId => (
  twoBorrowers,
  addOffers,
  isRefinancing,
) =>
  addLoanWithData({
    borrowers: twoBorrowers
      ? [completeFakeBorrower, completeFakeBorrower]
      : [completeFakeBorrower],
    properties: [fakeProperty],
    loan: {
      ...loanStep1,
      purchaseType: isRefinancing
        ? PURCHASE_TYPE.REFINANCING
        : PURCHASE_TYPE.ACQUISITION,
    },
    userId,
    addOffers,
  });

const DevPageContainer = compose(withProps(({ currentUser: { _id: userId } }) => ({
  addEmptyLoan: addEmptyLoan(userId),
  addLoanWithSomeData: addLoanWithSomeData(userId),
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
