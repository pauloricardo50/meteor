import React from 'react';

import Calculator from '../../../../utils/Calculator';
import { toMoney } from '../../../../utils/conversionFunctions';
import Tooltip from '../../../Material/Tooltip';
import T from '../../../Translation';
import FinancingSection, { CalculatedValue } from '../FinancingSection';
import { FORMATS } from '../FinancingSection/components/CalculatedValue';
import FinancingOwnFundsPicker from './FinancingOwnFundsPicker';
import FinancingOwnFundsStatus from './FinancingOwnFundsStatus';
import RequiredOwnFunds from './RequiredOwnFunds';

const feesTooltip = props => {
  const value = Calculator.getNotaryFeesTooltipValue(props);

  if (value) {
    return (
      <Tooltip title={`Frais de notaire: CHF ${toMoney(value)}`}>
        <span>&nbsp;+ frais</span>
      </Tooltip>
    );
  }

  return null;
};

const FinancingOwnFunds = props => (
  <FinancingSection
    summaryConfig={[
      {
        id: 'ownFunds',
        label: (
          <span className="section-title">
            <T id="FinancingOwnFunds.title" />
          </span>
        ),
        Component: props => (
          <div className="financing-ownFunds-summary ownFunds">
            <CalculatedValue
              value={Calculator.getNonPledgedOwnFunds}
              {...props}
            />
            <div className="flex-row center">
              <CalculatedValue
                value={Calculator.getOwnFundsRatio}
                format={FORMATS.PERCENT}
                {...props}
              />
              {feesTooltip(props)}
              <FinancingOwnFundsStatus
                value={Calculator.getMissingOwnFunds(props)}
                {...props}
              />
            </div>
          </div>
        ),
      },
    ]}
    detailConfig={[
      {
        Component: RequiredOwnFunds,
        id: 'requiredOwnFunds',
        calculateValue: Calculator.getMissingOwnFunds,
      },
      {
        Component: FinancingOwnFundsPicker,
        id: 'ownFundsPicker',
      },
    ]}
  />
);

export default FinancingOwnFunds;
