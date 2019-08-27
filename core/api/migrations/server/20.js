import { Migrations } from 'meteor/percolate:migrations';

import { BORROWER_DOCUMENTS } from 'core/api/files/fileConstants';
import Borrowers from '../../borrowers';

export const up = async () => {
  const allBorrowers = Borrowers.find({}).fetch();

  return Promise.all(allBorrowers.map(({ _id, thirdPartyFortune }) =>
    Borrowers.rawCollection().update(
      { _id },
      {
        $set: {
          donation: thirdPartyFortune
            ? [{ value: thirdPartyFortune, description: '' }]
            : [],
          thirdPartyLoan: [],
        },

        $unset: {
          thirdPartyFortune: true,
        },

        ...(thirdPartyFortune
          ? {
            $push: {
              additionalDocuments: {
                id: BORROWER_DOCUMENTS.DONATION_JUSTIFICATION,
              },
            },
          }
          : {}),
      },
    )));
};

export const down = async () => {
  const allBorrowers = Borrowers.find({}).fetch();

  return Promise.all(allBorrowers.map(({ _id, donation = [] }) =>
    Borrowers.rawCollection().update(
      {
        _id,
      },
      {
        ...(donation.length > 0
          ? {
            $set: {
              thirdPartyFortune: donation.reduce(
                (sum, { value }) => sum + value,
                0,
              ),
            },
          }
          : {}),

        $unset: { donation: true, thirdPartyLoan: true },
      },
    )));
};

Migrations.add({
  version: 20,
  name: 'Replace thirdPartyFortune with donation',
  up,
  down,
});
