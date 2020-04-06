import { Migrations } from 'meteor/percolate:migrations';

import Borrowers from '../../borrowers';
import { EXPENSES } from '../../borrowers/borrowerConstants';
import { BORROWER_DOCUMENTS } from '../../files/fileConstants';

export const up = async () => {
  const allBorrowers = Borrowers.find({}).fetch();

  return Promise.all([
    ...allBorrowers.map(({ _id, thirdPartyFortune }) =>
      Borrowers.rawCollection().update(
        { _id },
        {
          $set: {
            donation:
              thirdPartyFortune > 0
                ? [{ value: thirdPartyFortune, description: '' }]
                : [],
          },

          $unset: {
            thirdPartyFortune: true,
          },

          ...(thirdPartyFortune
            ? {
                $push: {
                  additionalDocuments: {
                    $each: [
                      {
                        id:
                          BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_CERTIFICATE,
                      },
                      {
                        id: BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_IDENTITY,
                      },
                      {
                        id: BORROWER_DOCUMENTS.DONATION_JUSTIFICATION_STATEMENT,
                      },
                    ],
                  },
                },
              }
            : {}),
        },
      ),
    ),
    ...allBorrowers.map(({ _id }) =>
      Borrowers.rawCollection().update(
        {
          _id,
          expenses: {
            $elemMatch: {
              description: 'THIRD_PARTY_FORTUNE_REIMBURSEMENT',
            },
          },
        },
        {
          $set: {
            'expenses.$.description': EXPENSES.THIRD_PARTY_LOAN_REIMBURSEMENT,
          },
        },
      ),
    ),
  ]);
};

export const down = async () => {
  const allBorrowers = Borrowers.find({}).fetch();

  return Promise.all([
    ...allBorrowers.map(({ _id, donation = [] }) =>
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

          $unset: { donation: true },
        },
      ),
    ),
    ...allBorrowers.map(({ _id }) =>
      Borrowers.rawCollection().update(
        {
          _id,
          expenses: {
            $elemMatch: {
              description: EXPENSES.THIRD_PARTY_LOAN_REIMBURSEMENT,
            },
          },
        },
        {
          $set: {
            'expenses.$.description': 'THIRD_PARTY_FORTUNE_REIMBURSEMENT',
          },
        },
      ),
    ),
  ]);
};

Migrations.add({
  version: 20,
  name: 'Replace thirdPartyFortune with donation',
  up,
  down,
});
