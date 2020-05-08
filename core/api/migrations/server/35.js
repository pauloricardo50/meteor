import { Migrations } from 'meteor/percolate:migrations';

import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const loans = LoanService.fetch({ structures: 1 });

  return Promise.all(
    loans.map(({ _id: loanId, structures = [] }) => {
      const newStructures = structures.map(structure => {
        const { wantedLoan, loanTranches = [] } = structure;

        const newLoanTranches = loanTranches.map(({ value, ...tranche }) => ({
          ...tranche,
          value: value * wantedLoan,
        }));

        return { ...structure, loanTranches: newLoanTranches };
      });

      return LoanService.baseUpdate(
        { _id: loanId },
        { $set: { structures: newStructures } },
      );
    }),
  );
};

export const down = () => {
  const loans = LoanService.fetch({ structures: 1 });

  return Promise.all(
    loans.map(({ _id: loanId, structures = [] }) => {
      const newStructures = structures.map(structure => {
        const { wantedLoan, loanTranches = [] } = structure;

        const newLoanTranches = loanTranches.map(({ value, ...tranche }) => ({
          ...tranche,
          value: value / wantedLoan,
        }));

        return { ...structure, loanTranches: newLoanTranches };
      });

      return LoanService.rawCollection.update(
        { _id: loanId },
        { $set: { structures: newStructures } },
      );
    }),
  );
};

Migrations.add({
  version: 35,
  name: 'Migrate loanTranches value to money',
  up,
  down,
});
