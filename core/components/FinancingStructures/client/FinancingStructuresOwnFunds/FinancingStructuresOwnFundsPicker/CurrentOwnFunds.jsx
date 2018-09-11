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
  structureId,
  ownFundsIndex,
}: CurrentOwnFundsProps) => (
  <div className="current-own-funds">
    <h5>
      <T id={`Forms.${type}`} /> -{' '}
      {usageType && <T id={`Forms.ownFundsUsageType.${usageType}`} />}
    </h5>
    <h6 className="secondary">
      {borrowers.find(({ _id }) => _id === borrowerId.firstName)}
    </h6>
    <h3>CHF {toMoney(value)}</h3>
    <FinancingStructuresOwnFundsDialog
      open={open}
      handleClose={handleClose}
      structureId={structureId}
      disableDelete
      ownFundsIndex={ownFundsIndex}
    />
  </div>
);

export default FinancingStructuresOwnFundsDialogContainer(CurrentOwnFunds);
