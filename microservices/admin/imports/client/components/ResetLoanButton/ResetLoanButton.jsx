// @flow
import React from 'react';
import { withProps, withState, compose } from 'recompose';

import Button from 'core/components/Button';
import { adminLoanReset } from 'imports/core/api/methods/index';

type ResetLoanButtonProps = {};

const ResetLoanButton = ({ loading, onClick }: ResetLoanButtonProps) => (
  <Button onClick={onClick} raised error disabled={loading}>
    Réinitialiser le dossier
  </Button>
);

export default compose(
  withState('loading', 'setLoading', false),
  withProps(({ loan, setLoading }) => ({
    onClick: () => {
      const { _id: loanId } = loan;
      const confirm = window.confirm('Réinitialiser le dossier ?');
      if (confirm) {
        setLoading(true);
        return adminLoanReset.run({ loanId }).then(() => setLoading(false));
      }
    },
  })),
)(ResetLoanButton);
