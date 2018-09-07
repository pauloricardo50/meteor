// @flow
import React from 'react';

import Button from '../../../../Button';
import T from '../../../../Translation';
import FinancingStructuresOwnFundsDialogContainer from './FinancingStructuresOwnFundsDialogContainer';
import FinancingStructuresOwnFundsDialog from './FinancingStructuresOwnFundsDialog';

type OwnFundsAdderProps = {};

const OwnFundsAdder = ({
  handleOpen,
  handleClose,
  open,
}: OwnFundsAdderProps) => (
  <React.Fragment>
    <Button raised primary onClick={handleOpen}>
      <T id="FinancingStructures.ownFundsAdder" />
    </Button>
    <FinancingStructuresOwnFundsDialog open={open} handleClose={handleClose} />
  </React.Fragment>
);

export default FinancingStructuresOwnFundsDialogContainer(OwnFundsAdder);
