// @flow
import React from 'react';

import Button from '../../../../Button';
import T from '../../../../Translation';
import FinancingOwnFundsDialogContainer from './FinancingOwnFundsDialogContainer';
import FinancingOwnFundsDialog from './FinancingOwnFundsDialog';

type OwnFundsAdderProps = {};

const OwnFundsAdder = ({
  handleOpen,
  handleClose,
  open,
  structureId,
  disabled,
}: OwnFundsAdderProps) => (
  <React.Fragment>
    <Button raised primary onClick={handleOpen} disabled={disabled}>
      <T id="Financing.ownFundsAdder" />
    </Button>
    <FinancingOwnFundsDialog
      open={open}
      handleClose={handleClose}
      structureId={structureId}
      disableDelete
      ownFundsIndex={-1}
    />
  </React.Fragment>
);

export default FinancingOwnFundsDialogContainer(OwnFundsAdder);
