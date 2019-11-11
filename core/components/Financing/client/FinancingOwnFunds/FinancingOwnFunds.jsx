// @flow
import React from 'react';

import T from 'core/components/Translation';
import { toMoney } from 'core/utils/conversionFunctions';
import Tooltip from 'core/components/Material/Tooltip';
import FinancingSection, { CalculatedValue } from '../FinancingSection';

import RequiredOwnFunds from './RequiredOwnFunds';
import FinancingOwnFundsPicker from './FinancingOwnFundsPicker';
import Calculator from '../../../../utils/Calculator';
import FinancingOwnFundsStatus from './FinancingOwnFundsStatus';
import { FORMATS } from '../FinancingSection/components/CalculatedValue';

type FinancingOwnFundsProps = {};

const feesTooltip = props => {
  const value = Calculator.getNotaryFeesTooltipValue(props);

  if (value) {
    return (
      <Tooltip title={`Frais de notaire: CHF ${toMoney(value)}`}>
        <p>&nbsp;+ frais</p>
      </Tooltip>
    );
  }

  return null;
};

const FinancingOwnFunds = (props: FinancingOwnFundsProps) => (
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
          <div className="financing-ownFunds-summary">
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
