// @flow
import React from 'react';

import { SUCCESS, ERROR } from '../../../../api/constants';
import StatusIcon from '../../../StatusIcon';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import { CalculatedValue } from '../FinancingStructuresSection';

type RequiredOwnFundsProps = {};

export const ROUNDING_AMOUNT = 5000;

const getLabel = (value) => {
  if (value > ROUNDING_AMOUNT) {
    return 'FinancingStructures.requiredOwnFunds.low';
  }
  if (value < -ROUNDING_AMOUNT) {
    return 'FinancingStructures.requiredOwnFunds.high';
  }

  return 'FinancingStructures.requiredOwnFunds.valid';
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
