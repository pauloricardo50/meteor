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

type FinancingStructuresOwnFundsDialogProps = {};

const FinancingStructuresOwnFundsDialog = ({
  handleClose,
  open,
  handleChange,
  handleSubmit,
  type,
  value,
  borrowerId,
  types,
  disableSubmit,
  disableDelete,
  structureId,
  usageType
}: FinancingStructuresOwnFundsDialogProps) => {
  const available = 0;
  const displayWarning = type && borrowerId && available < value;
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
          structureId={structureId}
          type={type}
          borrowerId={borrowerId}
          value={value}
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
        />
      </DialogContent>
      <FinancingStructuresOwnFundsActions
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        displayWarning={displayWarning}
        disableSubmit={disableSubmit}
        disableDelete={disableDelete}
      />
    </Dialog>
  );
};

export default FinancingStructuresOwnFundsPickerContainer(FinancingStructuresOwnFundsDialog);
