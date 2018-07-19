// @flow
import React from 'react';

import { INSURANCE_USE_PRESET } from '../../../../api/constants';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
  RadioButtons,
} from '../FinancingStructuresSection';

type FinancingStructuresOwnFundsProps = {};

const calculateOwnFunds = ({
  structure: { fortuneUsed, secondPillarUsed, thirdPillarUsed },
}) => fortuneUsed + secondPillarUsed + thirdPillarUsed;

const FinancingStructuresOwnFunds = (props: FinancingStructuresOwnFundsProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'ownFunds',
        label: <h3 className="section-title">Fonds Propres</h3>,
        Component: CalculatedValue,
        value: calculateOwnFunds,
        money: true,
      },
    ]}
    detailConfig={[
      { Component: InputAndSlider, id: 'fortuneUsed' },
      { Component: InputAndSlider, id: 'secondPillarUsed' },
      {
        Component: RadioButtons,
        id: 'secondPillarUsageType',
        options: Object.values(INSURANCE_USE_PRESET).map(key => ({
          id: key,
          label: key,
        })),
      },
      { Component: InputAndSlider, id: 'thirdPillarUsed' },
    ]}
  />
);

export default FinancingStructuresOwnFunds;
