import React, { useMemo } from 'react';
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
    { fields: 'borrower1', className: 'p-8' },
    { fields: 'borrower2', className: 'p-8' },
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
  const twoBorrowers = loan.borrowers.length >= 2;

  const layout = twoBorrowers ? borrowerFormLayout2 : borrowerFormLayout1;
  const className = twoBorrowers ? 'wide-form' : '';
  const schema = useMemo(
    () => getBorrowersFormSchema(loan.borrowers.length, borrowerSchema),
    [loan],
  );

  return (
    <OnboardingForm
      className={className}
      layout={layout}
      schema={schema}
      model={getModel(loan, borrowerSchema)}
      onSubmit={onSubmit}
      autoFormProps={{
        transformIntlId: id => {
          if (id.includes('borrower1') || id.includes('borrower2')) {
            const [part1, borr, ...rest] = id.split('.');
            return [part1, ...rest].join('.');
          }

          return id;
        },
      }}
      {...props}
    />
  );
};

export default OnboardingBorrowersForm;
