import React from 'react';
import { faMagic } from '@fortawesome/pro-light-svg-icons/faMagic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { WARNING } from '../../../../api/constants';
import { toMoney } from '../../../../utils/conversionFunctions';
import IconButton from '../../../IconButton';
import T from '../../../Translation';
import { getBorrowRatioStatus } from '../FinancingResult/financingResultHelpers';
import { getLabel as getRawLabel } from './financingOwnFundsHelpers';

const getLabel = props => {
  const { value } = props;
  const rawLabel = getRawLabel(value);
  const {
    status: borrowRatioStatus,
    tooltip: borrowRatioTooltip,
  } = getBorrowRatioStatus(props);

  if (rawLabel.endsWith('valid')) {
    const isBorrowRatioStatusWarning = borrowRatioStatus === WARNING;
    if (isBorrowRatioStatusWarning) {
      const {
        values: { requiredPledgedOwnFunds, currentPledgedOwnFunds } = {},
      } = borrowRatioTooltip;
      return (
        <>
          <span className="text">
            <T id="Financing.requiredOwnFunds.warning" />
          </span>
          <div className="value">
            <span className="chf">CHF</span>
            {toMoney(
              Math.abs(requiredPledgedOwnFunds - currentPledgedOwnFunds),
            )}
          </div>
        </>
      );
    }

    return (
      <>
        <span className="text">
          <T id={rawLabel} />
        </span>
        <div className="value">
          <span className="chf">CHF</span>
          {toMoney(Math.abs(value))}
        </div>
      </>
    );
  }

  return (
    <>
      <span className="text">
        <T id={rawLabel} />
      </span>
      <div className="value">
        <span className="chf">CHF</span>
        {toMoney(Math.abs(value))}
      </div>
      <span className="text">
        <T id="Financing.requiredOwnFunds.suffix" />
      </span>
    </>
  );
};

const RequiredOwnFundsBody = props => {
  const {
    value,
    suggestStructure,
    disableForms,
    loan = {},
    structureId,
  } = props;

  const { borrowers = [] } = loan;
  return (
    <div className="requiredOwnFunds-component-body">
      <div className="text-and-value">{getLabel(props)}</div>
      {!disableForms && !!borrowers.length && (
        <IconButton
          type={<FontAwesomeIcon icon={faMagic} />}
          onClick={suggestStructure}
          tooltip="Suggérer"
        />
      )}
    </div>
  );
};

export default RequiredOwnFundsBody;
