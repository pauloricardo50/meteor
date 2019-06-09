import { Migrations } from 'meteor/percolate:migrations';

import { Loans } from '../..';
import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const allLoans = Loans.find().fetch();

  return Promise.all(allLoans.map((loan) => {
    const { maxSolvency } = loan;
    if (maxSolvency) {
      const { canton } = maxSolvency;
      return LoanService.setMaxPropertyValueWithoutBorrowRatio({
        loanId: loan._id,
        canton,
      }).then(() =>
        Loans.rawCollection().update(
          { _id: loan._id },
          { $unset: { maxSolvency: true } },
        ));
    }

    return Promise.resolve();
  }));
};

export const down = () => {
  const allLoans = Loans.find().fetch();

  return Promise.all(allLoans.map((loan) => {
    const { maxPropertyValue } = loan;
    if (maxPropertyValue) {
      const {
        main: { max: maxMain },
        second: { max: maxSecond },
        canton,
        date,
      } = maxPropertyValue;

      // Schema would not be valid if we used LoanService.baseUpdate
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
          $unset: { maxPropertyValue: true },
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
