import { Migrations } from 'meteor/percolate:migrations';

import { OWN_FUNDS_TYPES } from '../../borrowers/borrowerConstants';
import Loans from '../../loans';

export const up = async () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(
    allLoans.map(({ _id, structures = [] }) => {
      const newStructures = structures.map(structure => {
        const { ownFunds = [] } = structure;
        const newOwnFunds = ownFunds.map(ownFund => {
          const { type } = ownFund;
          if (type === 'thirdPartyFortune') {
            return { ...ownFund, type: OWN_FUNDS_TYPES.DONATION };
          }
          return ownFund;
        });
        return { ...structure, ownFunds: newOwnFunds };
      });

      return Loans.rawCollection().update(
        {
          _id,
        },
        {
          $set: {
            structures: newStructures,
          },
        },
      );
    }),
  );
};

export const down = async () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(
    allLoans.map(({ _id, structures = [] }) => {
      const newStructures = structures.map(structure => {
        const { ownFunds = [] } = structure;
        const newOwnFunds = ownFunds.map(ownFund => {
          const { type } = ownFund;
          if (type === OWN_FUNDS_TYPES.DONATION) {
            return { ...ownFund, type: 'thirdPartyFortune' };
          }
          return ownFund;
        });
        return { ...structure, ownFunds: newOwnFunds };
      });

      return Loans.rawCollection().update(
        {
          _id,
        },
        {
          $set: {
            structures: newStructures,
          },
        },
      );
    }),
  );
};

Migrations.add({
  version: 21,
  name: 'Replace thirdPartyFortune with donation in structures',
  up,
  down,
});
