import { Migrations } from 'meteor/percolate:migrations';

import { INSURANCE_POTENTIAL } from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const loans = LoanService.fetch({
    $filters: { 'insuranceRequestLinks._id': { $exists: true } },
    _id: 1,
  });

  return Promise.all(
    loans.map(({ _id }) =>
      LoanService.rawCollection.update(
        { _id },
        { $set: { insurancePotential: INSURANCE_POTENTIAL.VALIDATED } },
      ),
    ),
  );
};

export const down = () => {
  const loans = LoanService.fetch({
    $filters: { insurancePotential: INSURANCE_POTENTIAL.VALIDATED },
    _id: 1,
  });

  return Promise.all(
    loans.map(({ _id }) =>
      LoanService.rawCollection.update(
        { _id },
        { $unset: { insurancePotential: true } },
      ),
    ),
  );
};

Migrations.add({
  version: 40,
  name:
    'Set insurancePotential to VALIDATED on loans with linkes insurance requests',
  up,
  down,
});
