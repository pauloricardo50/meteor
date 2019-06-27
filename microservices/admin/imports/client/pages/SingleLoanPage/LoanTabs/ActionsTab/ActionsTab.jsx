import React from 'react';
import PropTypes from 'prop-types';

import ConfirmMethod from 'core/components/ConfirmMethod';
import UserAssigner from 'core/components/UserAssigner';
import { loanDelete, assignLoanToUser } from 'core/api';
import LoanRenamer from './LoanRenamer';

const ActionsTab = ({ loan }) => (
  <div className="actions-tab">
    <LoanRenamer loan={loan} />

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
