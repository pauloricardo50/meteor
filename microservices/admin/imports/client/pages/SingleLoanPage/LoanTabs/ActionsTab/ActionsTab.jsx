import React from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-material/AutoForm';
import pick from 'lodash/pick';

import ConfirmMethod from 'core/components/ConfirmMethod';
import UserAssigner from 'core/components/UserAssigner';
import { loanDelete, loanUpdate, assignLoanToUser } from 'core/api';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { adminLoans } from 'core/api/loans/queries';

const ActionsTab = ({ loan }) => (
  <div className="actions-tab">
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
              import('../../../../../core/utils/message').then(({ default: message }) => {
                message.error('Ce numéro de dossier existe déjà');
              });
            } else {
              loanUpdate.run({
                loanId: loan._id,
                object: pick(doc, ['name']),
              });
            }
          })
      }
    />
    <ConfirmMethod
      label="Supprimer la demande"
      keyword="SUPPRIMER"
      method={cb => loanDelete.run({ loanId: loan._id }).then(cb)}
      buttonProps={{ error: true, raised: true, className: 'delete-button' }}
    />
    <UserAssigner
      title="Choisir utilisateur"
      buttonLabel="Choisir utilisateur"
      onUserSelect={userId =>
        assignLoanToUser.run({ userId, loanId: loan._id })
      }
      onUserDeselect={() =>
        assignLoanToUser.run({ userId: null, loanId: loan._id })
      }
      userId={loan.userId}
    />
  </div>
);

ActionsTab.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ActionsTab;
