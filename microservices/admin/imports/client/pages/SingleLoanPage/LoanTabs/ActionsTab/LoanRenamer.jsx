import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';

import React from 'react';

import { loanUpdate } from 'core/api/loans/methodDefinitions';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { AutoFormDialog } from 'core/components/AutoForm2';

const LoanRenamer = ({ loan }) => (
  <AutoFormDialog
    schema={LoanSchema.pick('name')}
    model={{ name: loan.name }}
    onSubmit={({ name }) =>
      new Promise((resolve, reject) => {
        createQuery({
          loans: { $filters: { name }, _id: 1 },
        }).fetchOne((err, res) => (err ? reject(err) : resolve(res)));
      }).then(result => {
        if (result) {
          throw new Error('Ce nom existe déjà');
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
