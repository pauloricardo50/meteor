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
    handleSubmit,
    handleDelete,
    type,
    value,
    borrowerId,
    types,
    disableSubmit,
    disableDelete,
    usageType,
    handleUpdateBorrower,
    handleCancelUpdateBorrower,
    otherValueOfTypeAndBorrower,
    allowPledge,
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
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          type={type}
          types={types}
          borrowerId={borrowerId}
          value={value}
          displayWarning={displayWarning}
          usageType={usageType}
          remaining={remaining}
          otherValueOfTypeAndBorrower={otherValueOfTypeAndBorrower}
          allowPledge={allowPledge}
        />
      </DialogContent>
      <FinancingStructuresOwnFundsActions
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        displayWarning={displayWarning}
        disableSubmit={disableSubmit}
        disableDelete={disableDelete}
        handleUpdateBorrower={handleUpdateBorrower}
        handleCancelUpdateBorrower={handleCancelUpdateBorrower(remaining)}
      />
    </Dialog>
  );
};

export default FinancingStructuresOwnFundsPickerContainer(FinancingStructuresOwnFundsDialog);
