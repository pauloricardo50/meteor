// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingSection, { CalculatedValue } from '../FinancingSection';

import RequiredOwnFunds from './RequiredOwnFunds';
import FinancingOwnFundsPicker from './FinancingOwnFundsPicker';
import Calculator from '../../../../utils/Calculator';

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
        Component: CalculatedValue,
        value: Calculator.getNonPledgedOwnFunds,
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
