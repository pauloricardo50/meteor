import React, { useMemo, useState } from 'react';
import pick from 'lodash/pick';

import { useOnboarding } from '../OnboardingContext';
import OnboardingForm from './OnboardingForm';
import { getBorrowersFormSchema } from './onboardingFormSchemas';

const borrowerFormLayout1 = {
  layout: [{ fields: 'borrower1', className: 'p-8' }],
  className: 'flex grow',
};

const borrowerFormLayout2 = {
  layout: [
    { fields: 'borrower1', className: 'pl-8 pr-8' },
    { fields: 'borrower2', className: 'pl-8 pr-8' },
  ],
  className: 'flex grow',
};

const getModelBase = (loan, borrowerSchema) => ({
  borrower1: pick(loan.borrowers[0], Object.keys(borrowerSchema)),
  borrower2: pick(loan.borrowers[1], Object.keys(borrowerSchema)),
});

const OnboardingBorrowersForm = ({
  borrowerSchema,
  onSubmit,
  getModel = getModelBase,
  ...props
}) => {
  const { loan } = useOnboarding();

  // Only get model initially, to avoid race-conditions
  const [initialModel] = useState(() =>
    getModel(
      loan,
      typeof borrowerSchema === 'function' ? borrowerSchema() : borrowerSchema,
    ),
  );
  const twoBorrowers = loan.borrowers.length >= 2;

  const layout = twoBorrowers ? borrowerFormLayout2 : borrowerFormLayout1;
  const className = twoBorrowers ? 'wide-form' : '';
  const schema = useMemo(
    () =>
      getBorrowersFormSchema({
        borrowerCount: loan.borrowers.length,
        schema: borrowerSchema,
        loanId: loan._id,
        borrowerIds: loan.borrowers.map(({ _id }) => _id),
      }),
    [loan, loan.borrowers.length],
  );

  return (
    <OnboardingForm
      className={className}
      layout={layout}
      schema={schema}
      getModel={() => initialModel}
      onSubmit={onSubmit}
      {...props}
    />
  );
};

export default OnboardingBorrowersForm;
