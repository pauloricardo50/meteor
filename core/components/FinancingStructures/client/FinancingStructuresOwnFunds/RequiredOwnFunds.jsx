// @flow
import React from 'react';

import { SUCCESS, ERROR } from '../../../../api/constants';
import StatusIcon from '../../../StatusIcon';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import { CalculatedValue } from '../FinancingStructuresSection';

type RequiredOwnFundsProps = {};

const RequiredOwnFunds = (props: RequiredOwnFundsProps) => (
  <CalculatedValue
    {...props}
    className="requiredOwnFunds requiredOwnFunds-component"
  >
    {value => (
      <React.Fragment>
        <span className="text">
          <T
            id={
              value === 0
                ? 'FinancingStructures.requiredOwnFunds.valid'
                : value > 0
                  ? 'FinancingStructures.requiredOwnFunds.low'
                  : 'FinancingStructures.requiredOwnFunds.high'
            }
          />
        </span>
        <div className="value">
          <span className="chf">CHF</span>
          {toMoney(value)}
          <StatusIcon
            status={value === 0 ? SUCCESS : ERROR}
            style={{ marginLeft: 8 }}
          />
        </div>
      </React.Fragment>
    )}
  </CalculatedValue>
);

export default RequiredOwnFunds;
