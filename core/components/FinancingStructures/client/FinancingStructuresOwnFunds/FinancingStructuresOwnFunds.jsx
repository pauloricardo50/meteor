// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingStructuresSection, {
  CalculatedValue,
} from '../FinancingStructuresSection';

import RequiredOwnFunds from './RequiredOwnFunds';
import FinancingStructuresOwnFundsPicker from './FinancingStructuresOwnFundsPicker';
import { calculateOwnFunds, calculateMissingOwnFunds } from './ownFundsHelpers';

type FinancingStructuresOwnFundsProps = {};

const FinancingStructuresOwnFunds = (props: FinancingStructuresOwnFundsProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'ownFunds',
        label: (
          <span className="section-title">
            <T id="FinancingStructuresOwnFunds.title" />
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
        Component: FinancingStructuresOwnFundsPicker,
        id: 'ownFundsPicker',
      },
    ]}
  />
);

export default FinancingStructuresOwnFunds;
