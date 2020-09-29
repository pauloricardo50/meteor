import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import T from '../../../../Translation';
import FinancingOwnFundsActions from './FinancingOwnFundsActions';
import FinancingOwnFundsPickerContainer, {
  FIELDS,
} from './FinancingOwnFundsPickerContainer';
import FinancingOwnFundsPickerForm from './FinancingOwnFundsPickerForm';
import { calculateRemainingFunds } from './FinancingOwnFundsPickerHelpers';
import FinancingOwnFundsPledgeWarning from './FinancingOwnFundsPledgeWarning';
import FinancingOwnFundsWithdrawWarning from './FinancingOwnFundsWithdrawWarning';
import OwnFundsCompleter from './OwnFundsCompleter';

const FinancingOwnFundsDialog = props => {
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
        <T defaultMessage="Allouer des fonds propres" />
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
