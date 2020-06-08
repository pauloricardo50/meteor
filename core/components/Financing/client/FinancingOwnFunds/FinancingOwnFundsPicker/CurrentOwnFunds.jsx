import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import T from '../../../../Translation';
import FinancingOwnFundsDialog from './FinancingOwnFundsDialog';
import FinancingOwnFundsDialogContainer from './FinancingOwnFundsDialogContainer';
import {
  getAvailableFundsOfTypeAndBorrower,
  getOwnFundsOfTypeAndBorrower,
} from './FinancingOwnFundsPickerHelpers';

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
}) => (
  <>
    <div
      className="current-own-funds"
      onClick={structure.disableForms ? null : handleOpen}
    >
      <b>
        <T id={`Forms.${type}`} />
        {usageType && ' - '}
        {usageType && <T id={`Forms.ownFundsUsageType.${usageType}`} />}
      </b>
      {borrowers.length > 1 && (
        <b className="secondary">
          {borrowers.find(({ _id }) => _id === borrowerId).firstName}
        </b>
      )}
      <p className="calculated-value">
        <span className="chf">CHF</span>{' '}
        <span className="primary">{toMoney(value)}</span>
      </p>
      {!hasEnoughFundsOfType({ structure, type, borrowerId, borrowers }) && (
        <p className="error">
          <T
            id="FinancingCurrentOwnFunds.error"
            values={{ type: <T id={`Forms.${type}`} /> }}
          />
        </p>
      )}
    </div>
    <FinancingOwnFundsDialog
      open={open}
      handleClose={handleClose}
      structureId={structureId}
      ownFundsIndex={ownFundsIndex}
    />
  </>
);

export default FinancingOwnFundsDialogContainer(CurrentOwnFunds);
