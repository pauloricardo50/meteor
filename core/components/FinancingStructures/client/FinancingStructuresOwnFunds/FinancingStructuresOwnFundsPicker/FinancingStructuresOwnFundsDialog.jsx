// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import T from '../../../../Translation';
import FinancingStructuresOwnFundsPickerContainer, {
  FIELDS,
} from './FinancingStructuresOwnFundsPickerContainer';
import FinancingStructuresOwnFundsActions from './FinancingStructuresOwnFundsActions';
import FinancingStructuresOwnFundsPickerForm from './FinancingStructuresOwnFundsPickerForm';
import OwnFundsCompleter from './OwnFundsCompleter';
import { calculateRemainingFunds } from './FinancingStructuresOwnFundsPickerHelpers';

type FinancingStructuresOwnFundsDialogProps = {};

const FinancingStructuresOwnFundsDialog = (props: FinancingStructuresOwnFundsDialogProps) => {
  const {
    handleClose,
    open,
    handleChange,
    type,
    value,
    borrowerId,
    handleCancelUpdateBorrower,
  } = props;
  const remaining = calculateRemainingFunds(props);
  const displayWarning = type && borrowerId && remaining < value;
  return (
    <Dialog
      open={open}
      onBackdropClick={handleClose}
      onEscapeKeyDown={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <T id="FinancingStructuresOwnFundsDialog.title" />
      </DialogTitle>
      <DialogContent>
        <OwnFundsCompleter
          {...props}
          handleChangeValue={val => handleChange(val, FIELDS.VALUE)}
        />
        <FinancingStructuresOwnFundsPickerForm
          {...props}
          displayWarning={displayWarning}
          remaining={remaining}
        />
      </DialogContent>
      <FinancingStructuresOwnFundsActions
        {...props}
        handleCancelUpdateBorrower={handleCancelUpdateBorrower(remaining)}
        displayWarning={displayWarning}
      />
    </Dialog>
  );
};

export default FinancingStructuresOwnFundsPickerContainer(FinancingStructuresOwnFundsDialog);
