import { Migrations } from 'meteor/percolate:migrations';

import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const loans = LoanService.fetch({ structures: 1 });

  return Promise.all(
    loans.map(({ _id: loanId, structures = [] }) =>
      Promise.all(
        structures.map(structure => {
          const { wantedLoan = 0, loanTranches = [] } = structure;

          const newLoanTranches = loanTranches.map(
            ({ value = 1, ...tranche }) => ({
              ...tranche,
              value: Math.round(value * wantedLoan || 0),
            }),
          );

          return LoanService.rawCollection.update(
            { _id: loanId, 'structures.id': structure.id },
            {
              $set: {
                'structures.$.loanTranches': newLoanTranches,
              },
            },
          );
        }),
      ),
    ),
  );
};

export const down = () => {
  const loans = LoanService.fetch({ structures: 1 });

  return Promise.all(
    loans.map(({ _id: loanId, structures = [] }) =>
      Promise.all(
        structures.map(structure => {
          const { wantedLoan = 0, loanTranches = [] } = structure;

          const newLoanTranches = loanTranches.map(
            ({ value = 0, ...tranche }) => {
              let newValue;
              if (!wantedLoan || !value) {
                newValue = 1;
              } else {
                newValue = value / wantedLoan;
              }
              return {
                ...tranche,
                value: newValue,
              };
            },
          );

          return LoanService.rawCollection.update(
            { _id: loanId, 'structures.id': structure.id },
            {
              $set: {
                'structures.$.loanTranches': newLoanTranches,
              },
            },
          );
        }),
      ),
    ),
  );
};

Migrations.add({
  version: 35,
  name: 'Migrate loanTranches value to money',
  up,
  down,
});
