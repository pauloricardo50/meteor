// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingStructuresSection';
import FinancingStructuresPropertyPicker from './FinancingStructuresPropertyPicker';
import FinancingCalculator, {
  getProperty,
} from '../FinancingStructuresCalculator';

type FinancingStructuresProjectProps = {};

const MAX_NOTARY_FEES_RATE = 0.1;

const calculateDefaultNotaryFees = data =>
  FinancingCalculator.getFeesBase(data);

const calculateMaxNotaryFees = data =>
  (getProperty(data).value + data.structure.propertyWork)
  * MAX_NOTARY_FEES_RATE;

const calculateProjectValue = data =>
  getProperty(data).value
  + data.structure.propertyWork
  + FinancingCalculator.getFeesBase(data);

const FinancingStructuresProject = (props: FinancingStructuresProjectProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'project',
        label: (
          <span className="section-title">
            <T id="FinancingStructuresProject.title" />
          </span>
        ),
        Component: CalculatedValue,
        value: calculateProjectValue,
      },
    ]}
    detailConfig={[
      { Component: FinancingStructuresPropertyPicker, id: 'propertyId' },
      {
        Component: InputAndSlider,
        id: 'notaryFees',
        calculatePlaceholder: calculateDefaultNotaryFees,
        max: calculateMaxNotaryFees,
        allowUndefined: true,
      },
      { Component: InputAndSlider, id: 'propertyWork' },
    ]}
  />
);

export default FinancingStructuresProject;
