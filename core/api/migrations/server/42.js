import { Migrations } from 'meteor/percolate:migrations';

import LoanService from '../../loans/server/LoanService';

const completeOnboarding = () => {
  const loans = LoanService.fetch({
    $filters: { applicationType: 'FULL' },
    _id: 1,
  });

  return loans.map(({ _id }) =>
    LoanService.rawCollection.update(
      { _id },
      { $set: { hasCompletedOnboarding: true } },
    ),
  );
};

const startOnboarding = () => {
  const loans = LoanService.fetch({ _id: 1 });

  return loans.map(({ _id }) =>
    LoanService.rawCollection.update(
      { _id },
      { $set: { hasStartedOnboarding: true } },
    ),
  );
};

export const up = () =>
  Promise.all([...completeOnboarding(), ...startOnboarding()]);

export const down = () => {
  const loans = LoanService.fetch({ _id: 1 });

  return Promise.all(
    loans.map(({ _id }) =>
      LoanService.rawCollection.update(
        { _id },
        {
          $unset: { hasCompletedOnboarding: true, hasStartedOnboarding: true },
        },
      ),
    ),
  );
};

Migrations.add({ version: 42, name: 'Migrate loans for onboarding', up, down });
