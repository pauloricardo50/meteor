// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingSection, { CalculatedValue } from '../FinancingSection';

import RequiredOwnFunds from './RequiredOwnFunds';
import FinancingOwnFundsPicker from './FinancingOwnFundsPicker';
import Calculator from '../../../../utils/Calculator';
import FinancingOwnFundsStatus from './FinancingOwnFundsStatus';
import { FORMATS } from '../FinancingSection/components/CalculatedValue';

type FinancingOwnFundsProps = {};

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
                value={Calculator.getCashRatio}
                format={FORMATS.PERCENT}
                {...props}
              />
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
