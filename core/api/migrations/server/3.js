import { Migrations } from 'meteor/percolate:migrations';

import { Loans } from '../..';

export const up = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(allLoans.map(loan =>
    Loans.rawCollection().update(
      { _id: loan._id },
      {
        $set: {
          ...loan.general,
          mortgageNotes: [],
          previousLoanTranches: [],
        },
        $unset: { general: 1 },
      },
    )));
};

export const down = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(allLoans.map(({
    _id,
    purchaseType,
    residenceType,
    canton,
    currentOwner,
    futureOwner,
    otherOwner,
  }) =>
    Loans.rawCollection().update(
      { _id },
      {
        $set: {
          general: {
            purchaseType,
            residenceType,
            canton,
            currentOwner,
            futureOwner,
            otherOwner,
          },
        },
        $unset: {
          purchaseType: 1,
          residenceType: 1,
          canton: 1,
          currentOwner: 1,
          futureOwner: 1,
          otherOwner: 1,
          mortgageNotes: 1,
        },
      },
    )));
};

Migrations.add({
  version: 3,
  name:
    'Remove general from loans, and add previousLoanTranches and mortgageNotes',
  up,
  down,
});
