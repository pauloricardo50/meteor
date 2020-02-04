//      
import React from 'react';
import { withProps, withState, compose } from 'recompose';

import Button from 'core/components/Button';
import { adminLoanReset } from 'core/api/methods/index';
import { LOAN_STATUS } from 'core/api/constants';

                               

const ResetLoanButton = ({
  loan: { status },
  loading,
  onClick,
}                      ) => (
  <Button
    onClick={onClick}
    outlined
    error
    disabled={loading || status !== LOAN_STATUS.TEST}
    tooltip={
      status !== LOAN_STATUS.TEST &&
      'Seuls les dossiers TEST peuvent être réinitialisés'
    }
  >
    Réinitialiser le dossier
  </Button>
);

export default compose(
  withState('loading', 'setLoading', false),
  withProps(({ loan, setLoading }) => ({
    onClick: () => {
      const { _id: loanId } = loan;
      const confirm = window.confirm(`Réinitialiser le dossier ? Les informations suivantes seront modifées:\n
      - Etape du dossier -> "Attestation de financement"
      - Interface -> "Simplifiée"
      - Suppression de la capacité d'achat
      `);
      if (confirm) {
        setLoading(true);
        return adminLoanReset.run({ loanId }).finally(() => setLoading(false));
      }
    },
  })),
)(ResetLoanButton);
