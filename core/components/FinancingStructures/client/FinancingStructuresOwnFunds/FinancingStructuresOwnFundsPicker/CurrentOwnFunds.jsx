// @flow
import React from 'react';

import T from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';
import FinancingStructuresOwnFundsDialogContainer from './FinancingStructuresOwnFundsDialogContainer';
import FinancingStructuresOwnFundsDialog from './FinancingStructuresOwnFundsDialog';

type CurrentOwnFundsProps = {};

const CurrentOwnFunds = ({
  ownFunds: { type, usageType, borrowerId, value },
  borrowers,
  open,
  handleClose,
  handleOpen,
  structureId,
  ownFundsIndex,
}: CurrentOwnFundsProps) => (
  <React.Fragment>
    <div className="current-own-funds" onClick={handleOpen}>
      <h5>
        <T id={`Forms.${type}`} />
        {usageType && ' - '}
        {usageType && <T id={`Forms.ownFundsUsageType.${usageType}`} />}
      </h5>
      <h5 className="secondary">
        {borrowers.find(({ _id }) => _id === borrowerId).firstName}
      </h5>
      <h4>CHF {toMoney(value)}</h4>
    </div>
    <FinancingStructuresOwnFundsDialog
      open={open}
      handleClose={handleClose}
      structureId={structureId}
      ownFundsIndex={ownFundsIndex}
    />
  </React.Fragment>
);

export default FinancingStructuresOwnFundsDialogContainer(CurrentOwnFunds);
