// @flow
import React from 'react';
import { withProps, withState, compose } from 'recompose';

import Button from 'core/components/Button';
import { adminLoanReset } from 'imports/core/api/methods/index';

type ResetLoanButtonProps = {};

const ResetLoanButton = ({ loading, onClick }: ResetLoanButtonProps) => (
  <Button onClick={onClick} outlined error disabled={loading}>
    Réinitialiser le dossier
  </Button>
);

export default compose(
  withState('loading', 'setLoading', false),
  withProps(({ loan, setLoading }) => ({
    onClick: () => {
      const { _id: loanId } = loan;
      const confirm = window.confirm(`Réinitialiser le dossier ? Les informations suivantes seront modifées:\n
      - Statut -> "Test"
      - Etape du dossier -> "Attestation de financement"
      - Interface -> "Simplifiée"
      - Suppression des plans financiers
      - Suppression de la capacité d'achat
      - Suppression des informations financières des emprunteurs
      `);
      if (confirm) {
        setLoading(true);
        return adminLoanReset.run({ loanId }).then(() => setLoading(false));
      }
    },
  })),
)(ResetLoanButton);
