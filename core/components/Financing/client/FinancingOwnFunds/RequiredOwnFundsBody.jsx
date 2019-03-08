// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic } from '@fortawesome/pro-light-svg-icons/faMagic';

import StatusIcon from '../../../StatusIcon';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import { OWN_FUNDS_ROUNDING_AMOUNT } from '../../../../config/financeConstants';
import { SUCCESS, ERROR } from '../../../../api/constants';
import IconButton from '../../../IconButton';

type RequiredOwnFundsBodyProps = {};

const getLabel = (value) => {
  if (value > OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.low';
  }
  if (value < -OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.high';
  }

  return 'Financing.requiredOwnFunds.valid';
};

const RequiredOwnFundsBody = ({
  value,
  suggestStructure,
  disableForms,
}: RequiredOwnFundsBodyProps) => (
  <div className="requiredOwnFunds-component-body">
    <div className="text-and-value">
      <span className="text">
        <T id={getLabel(value)} />
      </span>
      <div className="value">
        <span className="chf">CHF</span>
        {toMoney(value)}
        <StatusIcon
          status={getLabel(value).endsWith('valid') ? SUCCESS : ERROR}
          style={{ marginLeft: 8 }}
        />
      </div>
    </div>
    {!disableForms && (
      <IconButton
        type={<FontAwesomeIcon icon={faMagic} />}
        onClick={suggestStructure}
        tooltip="Suggérer"
      />
    )}
  </div>
);

export default RequiredOwnFundsBody;
