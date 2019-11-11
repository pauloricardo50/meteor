import { Migrations } from 'meteor/percolate:migrations';

import { Loans } from '../..';

export const up = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(
    allLoans.map(({ _id, general }) =>
      Loans.rawCollection().update(
        { _id },
        {
          $set: {
            ...general,
            previousLoanTranches: [],
          },
          $unset: { general: true },
        },
      ),
    ),
  );
};

export const down = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(
    allLoans.map(
      ({
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
              purchaseType: true,
              residenceType: true,
              canton: true,
              currentOwner: true,
              futureOwner: true,
              otherOwner: true,
            },
          },
        ),
    ),
  );
};

Migrations.add({
  version: 3,
  name: 'Remove general from loans, and add previousLoanTranches',
  up,
  down,
});
