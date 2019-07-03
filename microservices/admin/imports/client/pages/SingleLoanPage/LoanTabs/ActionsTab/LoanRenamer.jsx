// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import pick from 'lodash/pick';
import { withState } from 'recompose';

import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { adminLoans } from 'core/api/loans/queries';
import { loanUpdate } from 'core/api';

type LoanRenamerProps = {
  loan: Object,
  error: Boolean,
  setError: Function,
};

const LoanRenamer = ({ loan, error, setError }: LoanRenamerProps) => (
  <AutoForm
    className="name-form"
    schema={LoanSchema.pick('name')}
    model={loan}
    onSubmit={doc =>
      adminLoans
        .clone({ name: doc.name, $body: { _id: 1 } })
        .fetchOneSync()
        .then((result) => {
          if (result) {
            import('../../../../../core/utils/message')
              .then(({ default: message }) => {
                message.error('Ce numéro de dossier existe déjà');
              })
              .then(() => setError('Ce numéro existe déjà'));
          } else {
            loanUpdate
              .run({
                loanId: loan._id,
                object: pick(doc, ['name']),
              })
              .then(() =>
                import('../../../../../core/utils/message').then(({ default: message }) => {
                  message.success("C'est dans la boîte!");
                }))
              .then(() => setError('Numéro acuel'));
          }
        })
    }
    onChange={(key, value) => {
      if (loan.name === value) {
        setError('Numéro actuel');
      } else {
        setError(false);
      }
    }}
    error={error}
    showInlineError={false}
  />
);

export default withState('error', 'setError', 'Numéro actuel')(LoanRenamer);
