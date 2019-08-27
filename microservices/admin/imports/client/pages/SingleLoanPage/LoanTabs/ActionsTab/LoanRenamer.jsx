// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { adminLoans } from 'core/api/loans/queries';
import { loanUpdate } from 'core/api';

type LoanRenamerProps = {
  loan: Object,
};

const LoanRenamer = ({ loan }: LoanRenamerProps) => (
  <AutoFormDialog
    schema={LoanSchema.pick('name')}
    model={{ name: loan.name }}
    onSubmit={({ name }) =>
      adminLoans
        .clone({ name, $body: { _id: 1 } })
        .fetchOneSync()
        .then((result) => {
          if (result) {
            throw new Error('Ce nom exist deja');
          }

          return loanUpdate.run({ loanId: loan._id, object: { name } });
        })
    }
    buttonProps={{
      raised: true,
      primary: true,
      label: 'Changer No. de dossier',
    }}
    title="Changer No. de dossier"
  />
);

export default LoanRenamer;
