import { withProps } from 'recompose';

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
import { getRandomOffer } from '../../api/offers/fakes';
import { fakeProperty, emptyProperty } from '../../api/properties/fakes';
import {
  borrowerInsert,
  propertyInsert,
  loanInsert,
  offerInsert,
  loanUpdate,
} from '../../api';

const addEmptyStep1Loan = (twoBorrowers) => {
  const borrowerIds = [];
  borrowerInsert
    .run({ borrower: emptyFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? borrowerInsert.run({ borrower: emptyFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return propertyInsert.run({ property: emptyProperty });
    })
    .then((propertyId) => {
      const loan = emptyLoan;
      loan.borrowerIds = borrowerIds;
      loan.propertyIds = [propertyId];
      loanInsert.run({ loan });
    })
    .catch(console.log);
};

const addStep1Loan = (twoBorrowers) => {
  const borrowerIds = [];
  borrowerInsert
    .run({ borrower: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? borrowerInsert.run({ borrower: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return propertyInsert.run({ property: fakeProperty });
    })
    .then((propertyId) => {
      const loan = loanStep1;
      loan.borrowerIds = borrowerIds;
      loan.propertyIds = [propertyId];
      loanInsert.run({ loan });
    })
    .catch(console.log);
};

const addStep2Loan = (twoBorrowers) => {
  const borrowerIds = [];

  borrowerInsert
    .run({ borrower: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? borrowerInsert.run({ borrower: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return propertyInsert.run({ property: fakeProperty });
    })
    .then((propertyId) => {
      const loan = loanStep2;
      loan.borrowerIds = borrowerIds;
      loan.propertyIds = [propertyId];
      loanInsert.run({ loan });
    })
    .catch(console.log);
};

const addStep3Loan = (twoBorrowers, completeFiles = true) => {
  const borrowerIds = [];
  const loan = loanStep3(completeFiles);
  let loanId;
  borrowerInsert
    .run({ borrower: completeFakeBorrower })
    .then((id1) => {
      borrowerIds.push(id1);
      return twoBorrowers
        ? borrowerInsert.run({ borrower: completeFakeBorrower })
        : false;
    })
    .then((id2) => {
      if (id2) {
        borrowerIds.push(id2);
      }

      return propertyInsert.run({ property: fakeProperty });
    })
    .then((propertyId) => {
      loan.borrowerIds = borrowerIds;
      loan.propertyIds = [propertyId];
    })
    .then(() => loanInsert.run({ loan }))
    .then((id) => {
      loanId = id;
      const object = getRandomOffer(
        { loan: { ...loan, _id: id }, property: fakeProperty },
        true,
      );
      return offerInsert.run({ offer: object, loanId });
    })
    .then(offerId =>
      loanUpdate.run({
        object: {
          'logic.lender.offerId': offerId,
          'logic.lender.chosenTime': new Date(),
        },
        loanId,
      }))
    .then(() => {
      // Weird bug with offers publications that forces me to reload TODO: fix it
      location.reload();
    })
    .catch(console.log);
};

const DevPageContainer = withProps({
  addEmptyStep1Loan,
  addStep1Loan,
  addStep2Loan,
  addStep3Loan,
});

export default DevPageContainer;
