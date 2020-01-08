import { Migrations } from 'meteor/percolate:migrations';

import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const loans = LoanService.fetch({
    $filters: { selectedStructure: { $exists: true } },
    selectedStructure: 1,
    structures: 1,
    lenders: { offers: { _id: 1 }, organisation: { _id: 1 } },
  });

  return Promise.all(
    loans.map(loan => {
      const {
        _id: loanId,
        selectedStructure,
        structures = [],
        lenders = [],
      } = loan;
      const { offerId } = structures.find(({ id }) => id === selectedStructure);
      const selectedLenderOrganisation =
        lenders.find(({ offers = [] }) =>
          offers.some(({ _id }) => _id === offerId),
        ) || {};

      const {
        organisation: { _id: selectedLenderOrganisationId } = {},
      } = selectedLenderOrganisation;

      if (selectedLenderOrganisationId) {
        return LoanService.rawCollection.update(
          { _id: loanId },
          {
            $set: {
              selectedLenderOrganisationLink: {
                _id: selectedLenderOrganisationId,
              },
            },
          },
        );
      }

      return Promise.resolve();
    }),
  );
};

export const down = () =>
  LoanService.rawCollection.update(
    {},
    { $unset: { selectedLenderOrganisationLink: true } },
    { multi: true },
  );

Migrations.add({
  version: 30,
  name: 'Add selected lender organisation link on loans',
  up,
  down,
});
