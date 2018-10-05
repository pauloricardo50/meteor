// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingSection, {
  CalculatedValue,
} from '../FinancingSection';

import RequiredOwnFunds from './RequiredOwnFunds';
import FinancingOwnFundsPicker from './FinancingOwnFundsPicker';
import { calculateOwnFunds, calculateMissingOwnFunds } from './ownFundsHelpers';

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
        value: calculateOwnFunds,
      },
    ]}
    detailConfig={[
      {
        Component: RequiredOwnFunds,
        id: 'requiredOwnFunds',
        value: calculateMissingOwnFunds,
      },
      {
        Component: FinancingOwnFundsPicker,
        id: 'ownFundsPicker',
      },
    ]}
  />
);

export default FinancingOwnFunds;
