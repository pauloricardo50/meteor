import React from 'react';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SUCCESS, WARNING } from '../../../../api/constants';
import colors from '../../../../config/colors';
import { toMoney } from '../../../../utils/conversionFunctions';
import Tooltip from '../../../Material/Tooltip';
import StatusIcon from '../../../StatusIcon';
import T, { Money } from '../../../Translation';
import { getBorrowRatioStatus } from '../FinancingResult/financingResultHelpers';
import { getLabel } from './financingOwnFundsHelpers';

const FinancingOwnFundsStatus = ({ value, ...props }) => {
  const {
    status: borrowRatioStatus,
    tooltip: borrowRatioTooltip,
  } = getBorrowRatioStatus(props);
  const label = getLabel(value);
  const tooltip = (
    <T
      id={`${label}.tooltip`}
      values={{ value: <Money value={Math.abs(value)} /> }}
    />
  );

  if (label.endsWith('valid')) {
    const isBorrowRatioStatusWarning = borrowRatioStatus === WARNING;
    const {
      values: {
        requiredPledgedOwnFunds,
        currentPledgedOwnFunds,
        wantedLoan,
      } = {},
    } = borrowRatioTooltip;
    const values = {
      requiredPledgedOwnFunds: toMoney(requiredPledgedOwnFunds),
      currentPledgedOwnFunds: toMoney(currentPledgedOwnFunds),
      wantedLoan: toMoney(wantedLoan),
    };
    return (
      <StatusIcon
        status={isBorrowRatioStatusWarning ? borrowRatioStatus : SUCCESS}
        tooltip={
          isBorrowRatioStatusWarning ? (
            <T id={borrowRatioTooltip.id} values={values} />
          ) : (
            tooltip
          )
        }
        style={{ marginLeft: 8 }}
      />
    );
  }

  return (
    <Tooltip title={tooltip} placement="right" enterTouchDelay={0}>
      <span className="fa-layers fa-fw own-funds-icon">
        <FontAwesomeIcon
          icon={faCircle}
          transform="grow-8"
          color={colors.error}
        />
        <FontAwesomeIcon
          icon={faDollarSign}
          transform="shrink-4 left-3"
          color="white"
        />
        <FontAwesomeIcon
          icon={label.endsWith('high') ? faArrowDown : faArrowUp}
          transform={`shrink-8 right-4 ${
            label.endsWith('high') ? 'down-2' : 'up-2'
          }`}
          color="white"
        />
      </span>
    </Tooltip>
  );
};

export default FinancingOwnFundsStatus;
