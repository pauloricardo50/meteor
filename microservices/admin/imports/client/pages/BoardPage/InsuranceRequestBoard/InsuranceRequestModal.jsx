import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import SingleInsuranceRequestPage from '../../SingleInsuranceRequestPage';

const InsuranceRequestModal = ({
  insuranceRequestId,
  closeModal,
  currentUser,
}) => (
  <Dialog
    open={!!insuranceRequestId}
    onEscapeKeyDown={closeModal}
    onBackdropClick={closeModal}
    fullWidth
    maxWidth="xl"
  >
    <div className="loan-board-single-loan-page">
      <SingleInsuranceRequestPage
        insuranceRequestId={insuranceRequestId}
        currentUser={currentUser}
        enableTabRouting={false}
      />
    </div>
  </Dialog>
);

export default InsuranceRequestModal;
