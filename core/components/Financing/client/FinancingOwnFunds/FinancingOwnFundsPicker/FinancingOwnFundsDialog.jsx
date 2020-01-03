// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import T from '../../../../Translation';
import FinancingOwnFundsPickerContainer, {
  FIELDS,
} from './FinancingOwnFundsPickerContainer';
import FinancingOwnFundsActions from './FinancingOwnFundsActions';
import FinancingOwnFundsPickerForm from './FinancingOwnFundsPickerForm';
import OwnFundsCompleter from './OwnFundsCompleter';
import FinancingOwnFundsPledgeWarning from './FinancingOwnFundsPledgeWarning';
import FinancingOwnFundsWithdrawWarning from './FinancingOwnFundsWithdrawWarning';
import { calculateRemainingFunds } from './FinancingOwnFundsPickerHelpers';

type FinancingOwnFundsDialogProps = {};

const FinancingOwnFundsDialog = (props: FinancingOwnFundsDialogProps) => {
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
        <T id="FinancingOwnFundsDialog.title" />
      </DialogTitle>
      <DialogContent>
        <OwnFundsCompleter
          {...props}
          handleChangeValue={val => handleChange(val, FIELDS.VALUE)}
        />
        <FinancingOwnFundsPickerForm
          {...props}
          displayWarning={displayWarning}
          remaining={remaining}
        />
        <FinancingOwnFundsPledgeWarning {...props} />
        <FinancingOwnFundsWithdrawWarning {...props} />
      </DialogContent>
      <FinancingOwnFundsActions
        {...props}
        handleCancelUpdateBorrower={handleCancelUpdateBorrower(remaining)}
        displayWarning={displayWarning}
      />
    </Dialog>
  );
};

export default FinancingOwnFundsPickerContainer(FinancingOwnFundsDialog);
