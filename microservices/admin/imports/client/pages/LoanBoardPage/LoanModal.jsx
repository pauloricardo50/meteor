//      
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import SingleLoanPage from '../SingleLoanPage';

                         

const LoanModal = ({ loanId, closeModal, currentUser }                ) => (
  <Dialog
    open={!!loanId}
    onEscapeKeyDown={closeModal}
    onBackdropClick={closeModal}
    fullWidth
    maxWidth="xl"
  >
    <div className="loan-board-single-loan-page">
      <SingleLoanPage
        loanId={loanId}
        currentUser={currentUser}
        enableTabRouting={false}
      />
    </div>
  </Dialog>
);

export default LoanModal;
