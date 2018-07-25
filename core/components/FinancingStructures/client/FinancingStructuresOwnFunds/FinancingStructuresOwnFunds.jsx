// @flow
import React from 'react';

import T from 'core/components/Translation';
import { INSURANCE_USE_PRESET } from '../../../../api/constants';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
  RadioButtons,
} from '../FinancingStructuresSection';

type FinancingStructuresOwnFundsProps = {};

const calculateOwnFunds = ({
  structure: {
    fortuneUsed,
    secondPillarPledged,
    secondPillarWithdrawal,
    thirdPillarPledged,
    thirdPillarWithdrawal,
  },
}) => fortuneUsed
  + secondPillarPledged
  + secondPillarWithdrawal
  + thirdPillarPledged
  + thirdPillarWithdrawal;

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
      { Component: InputAndSlider, id: 'fortuneUsed' },
      { Component: InputAndSlider, id: 'secondPillarPledged' },
      { Component: InputAndSlider, id: 'secondPillarWithdrawal' },
      { Component: InputAndSlider, id: 'thirdPillarPledged' },
      { Component: InputAndSlider, id: 'thirdPillarWithdrawal' },
    ]}
  />
);

export default FinancingStructuresOwnFunds;
