// @flow
import React from 'react';

import { SUCCESS, ERROR } from '../../../../api/constants';
import StatusIcon from '../../../StatusIcon';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import { OWN_FUNDS_ROUNDING_AMOUNT } from '../../../../config/financeConstants';
import { CalculatedValue } from '../FinancingSection';

type RequiredOwnFundsProps = {};

const getLabel = (value) => {
  if (value > OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.low';
  }
  if (value < -OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.high';
  }

  return 'Financing.requiredOwnFunds.valid';
};

export const RequiredOwnFundsBody = ({ value }) => (
  <React.Fragment>
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
  </React.Fragment>
);

const RequiredOwnFunds = (props: RequiredOwnFundsProps) => (
  <CalculatedValue
    {...props}
    className="requiredOwnFunds requiredOwnFunds-component"
  >
    {value => <RequiredOwnFundsBody value={value} />}
  </CalculatedValue>
);

export default RequiredOwnFunds;
