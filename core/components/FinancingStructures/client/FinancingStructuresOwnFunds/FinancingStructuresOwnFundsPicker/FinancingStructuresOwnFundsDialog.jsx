// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

import T from '../../../../Translation';
import FinancingStructuresOwnFundsPickerContainer from './FinancingStructuresOwnFundsPickerContainer';
import FinancingStructuresOwnFundsActions from './FinancingStructuresOwnFundsActions';
import FinancingStructuresOwnFundsPickerForm from './FinancingStructuresOwnFundsPickerForm';

type FinancingStructuresOwnFundsDialogProps = {};

const FinancingStructuresOwnFundsDialog = ({
  handleClose,
  open,
}: FinancingStructuresOwnFundsDialogProps) => (
  <Dialog
    open={open}
    onBackdropClick={handleClose}
    onEscapeKeyDown={handleClose}
  >
    <DialogTitle>
      <T id="FinancingStructuresOwnFundsDialog.title" />
    </DialogTitle>
    <FinancingStructuresOwnFundsPickerForm />
    <FinancingStructuresOwnFundsActions handleClose={handleClose} />
  </Dialog>
);

export default FinancingStructuresOwnFundsPickerContainer(FinancingStructuresOwnFundsDialog);
