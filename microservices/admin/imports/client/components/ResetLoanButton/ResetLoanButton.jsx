import React from 'react';
import { compose, withProps, withState } from 'recompose';

import { LOAN_STATUS } from 'core/api/loans/loanConstants';
import { adminLoanReset } from 'core/api/loans/methodDefinitions';
import Button from 'core/components/Button';

const ResetLoanButton = ({ loan: { status }, loading, onClick }) => (
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
      - Etape du dossier -> "Accord de principe"
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
