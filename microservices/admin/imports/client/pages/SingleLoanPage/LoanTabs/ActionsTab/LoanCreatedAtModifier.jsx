import React from 'react';

import { loanUpdateCreatedAt } from 'core/api/loans/methodDefinitions';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { AutoFormDialog } from 'core/components/AutoForm2';

const LoanCreatedAtModifier = ({ loan }) => (
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
