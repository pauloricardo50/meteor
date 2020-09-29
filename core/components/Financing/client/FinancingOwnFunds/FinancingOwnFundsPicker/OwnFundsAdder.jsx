import React from 'react';

import Button from '../../../../Button';
import T from '../../../../Translation';
import FinancingOwnFundsDialog from './FinancingOwnFundsDialog';
import FinancingOwnFundsDialogContainer from './FinancingOwnFundsDialogContainer';

const OwnFundsAdder = ({
  handleOpen,
  handleClose,
  open,
  structureId,
  disabled,
}) => (
  <>
    <Button raised primary onClick={handleOpen} disabled={disabled}>
      <T defaultMessage="Ajouter fonds propres" />
    </Button>
    <FinancingOwnFundsDialog
      open={open}
      handleClose={handleClose}
      structureId={structureId}
      disableDelete
      ownFundsIndex={-1}
    />
  </>
);

export default FinancingOwnFundsDialogContainer(OwnFundsAdder);
