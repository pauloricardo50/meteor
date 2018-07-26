// @flow
import React from 'react';

import { AMORTIZATION_STRATEGY_PRESET } from '../../../../api/constants';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
  RadioButtons,
} from '../FinancingStructuresSection';
import T from '../../../Translation';

const getPledgedAmount = ({
  structure: { secondPillarPledged, thirdPillarPledged },
}) => secondPillarPledged + thirdPillarPledged;

const calculateLoan = (params) => {
  const {
    structure: { wantedLoan },
  } = params;
  return wantedLoan + getPledgedAmount(params);
};

const oneStructureHasPledge = structures => structures.some(({ secondPillarPledged, thirdPillarPledged }) => secondPillarPledged || thirdPillarPledged);

type FinancingStructuresFinancingProps = {};

const FinancingStructuresFinancing = (props: FinancingStructuresFinancingProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'mortgageLoan',
        label: (
          <span className="section-title">
            <T id="FinancingStructuresFinancing.title" />
          </span>
        ),
        Component: CalculatedValue,
        value: calculateLoan,
      },
    ]}
    detailConfig={[
      { Component: InputAndSlider, id: 'wantedLoan' },
      {
        Component: RadioButtons,
        id: 'amortizationType',
        options: Object.values(AMORTIZATION_STRATEGY_PRESET).map(key => ({
          id: key,
          label: key,
        })),
      },
      {
        id: 'pledgedIncrease',
        Component: CalculatedValue,
        value: getPledgedAmount,
        condition: oneStructureHasPledge,
      },
    ]}
  />
);

export default FinancingStructuresFinancing;
