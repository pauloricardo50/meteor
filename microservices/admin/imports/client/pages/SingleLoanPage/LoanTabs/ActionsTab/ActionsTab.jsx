import React from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms-material/AutoForm';
import pick from 'lodash/pick';

import ConfirmMethod from 'core/components/ConfirmMethod';
import { loanDelete, loanUpdate } from 'core/api';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import loanWithName from 'core/api/loans/queries/loanWithName'
import message from 'core/utils/message'

const ActionsTab = ({ loan }) => (
  <div className="actions-tab">
    <AutoForm
      className="name-form"
      schema={LoanSchema.pick('name')}
      model={loan}
      onSubmit={doc =>
        loanWithName
          .clone({ name: doc.name })
          .fetchOneSync()
          .then(result =>
            (result
              ? message.error('Ce nom de dossier existe déjà')
              : loanUpdate.run({
                loanId: loan._id,
                object: pick(doc, ['name']),
              })))
      }
    />
    <ConfirmMethod
      label="Supprimer la demande"
      keyword="SUPPRIMER"
      method={cb =>
        loanDelete
          .run({ loanId: loan._id })
          .then(cb)
          .catch(console.log)
      }
      buttonProps={{ error: true, raised: true, className: 'delete-button' }}
    />
  </div>
);

ActionsTab.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ActionsTab;
