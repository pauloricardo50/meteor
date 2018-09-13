// @flow
import React from 'react';

import T from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';
import FinancingStructuresOwnFundsDialogContainer from './FinancingStructuresOwnFundsDialogContainer';
import FinancingStructuresOwnFundsDialog from './FinancingStructuresOwnFundsDialog';
import {
  getOwnFundsOfTypeAndBorrower,
  getAvailableFundsOfTypeAndBorrower,
} from './FinancingStructuresOwnFundsPickerHelpers';

type CurrentOwnFundsProps = {};

const hasEnoughFundsOfType = ({ structure, type, borrowerId, borrowers }) =>
  getAvailableFundsOfTypeAndBorrower({
    type,
    borrowerId,
    borrowers,
  }) >= getOwnFundsOfTypeAndBorrower({ structure, type, borrowerId });

export const CurrentOwnFunds = ({
  ownFunds: { type, usageType, borrowerId, value },
  structure,
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
      {borrowers.length > 1 && (
        <h5 className="secondary">
          {borrowers.find(({ _id }) => _id === borrowerId).firstName}
        </h5>
      )}
      <p className="calculated-value">
        <span className="chf">CHF</span>{' '}
        <span className="primary">{toMoney(value)}</span>
      </p>
      {!hasEnoughFundsOfType({ structure, type, borrowerId, borrowers }) && (
        <p className="error">
          <T
            id="FinancingStructuresCurrentOwnFunds.error"
            values={{ type: <T id={`Forms.${type}`} /> }}
          />
        </p>
      )}
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
