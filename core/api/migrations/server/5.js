import { Migrations } from 'meteor/percolate:migrations';

import { Loans } from '../..';
import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const allLoans = Loans.find().fetch();

  return Promise.all(allLoans.map((loan) => {
    const { maxSolvency } = loan;
    if (maxSolvency) {
      const { canton } = maxSolvency;
      return LoanService.getMaxPropertyValueWithoutBorrowRatio({
        loanId: loan._id,
        canton,
      });
    }

    return Promise.resolve();
  }));
};

export const down = () => {
  const allLoans = Loans.find().fetch();

  return Promise.all(allLoans.map((loan) => {
    const { maxSolvency } = loan;
    if (maxSolvency) {
      const {
        main: { max: maxMain },
        second: { max: maxSecond },
        canton,
        date,
      } = maxSolvency;

      return Loans.rawCollection().update(
        { _id: loan._id },
        {
          $set: {
            maxSolvency: {
              date,
              canton,
              main: maxMain,
              second: maxSecond,
            },
          },
        },
      );
    }
  }));
};

Migrations.add({
  version: 5,
  name: 'Add lender rules to max solvency',
  up,
  down,
});
