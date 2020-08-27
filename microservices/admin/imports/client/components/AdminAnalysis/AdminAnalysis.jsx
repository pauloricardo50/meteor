import React from 'react';

import { loanUpdate } from 'core/api/loans/methodDefinitions';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import AutoForm from 'core/components/AutoForm2';

const AdminAnalysis = ({ loan, ...props }) => (
  <AutoForm
    schema={LoanSchema.pick('adminAnalysis')}
    model={loan}
    onSubmit={({ adminAnalysis }) =>
      loanUpdate.run({ loanId: loan._id, object: { adminAnalysis } })
    }
    submitFieldProps={{ label: 'Sauver' }}
    {...props}
  />
);

export default AdminAnalysis;
