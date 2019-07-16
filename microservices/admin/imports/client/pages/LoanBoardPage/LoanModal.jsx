// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import SingleLoanPage from '../SingleLoanPage';

type LoanModalProps = {};

const LoanModal = ({ loanId, closeModal, currentUser }: LoanModalProps) => (
  <Dialog
    open={!!loanId}
    onEscapeKeyDown={closeModal}
    onBackdropClick={closeModal}
    fullWidth
    maxWidth="xl"
  >
    <SingleLoanPage
      loanId={loanId}
      currentUser={currentUser}
      enableTabRouting={false}
    />
  </Dialog>
);

export default LoanModal;
