// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { loanUpdateCreatedAt } from 'core/api';

type LoanCreatedAtModifierProps = {
  loan: Object,
};

const LoanCreatedAtModifier = ({ loan }: LoanCreatedAtModifierProps) => (
  <AutoFormDialog
    schema={LoanSchema.pick('createdAt')}
    model={{ createdAt: loan.createdAt }}
    onSubmit={({ createdAt }) =>
      loanUpdateCreatedAt.run({
        loanId: loan._id,
        createdAt: new Date(createdAt),
      })
    }
    buttonProps={{
      raised: true,
      primary: true,
      label: 'Changer date de création',
    }}
    title="Changer date de création"
  />
);

export default LoanCreatedAtModifier;
