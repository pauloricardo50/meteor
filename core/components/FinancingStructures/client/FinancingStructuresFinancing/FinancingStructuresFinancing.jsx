// @flow
import React from 'react';

import { AMORTIZATION_STRATEGY_PRESET } from '../../../../api/constants';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
  RadioButtons,
} from '../FinancingStructuresSection';
import T from '../../../Translation';

const calculateLoan = ({ structure: { wantedLoan } }) => wantedLoan;

type FinancingStructuresFinancingProps = {};

const FinancingStructuresFinancing = (props: FinancingStructuresFinancingProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'mortgageLoan',
        label: (
          <h3 className="section-title">
            <T id="general.mortgageLoan" />
          </h3>
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
    ]}
  />
);

export default FinancingStructuresFinancing;
