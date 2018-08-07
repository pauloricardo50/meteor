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

const calculateNotaryFees = data =>
  getProperty(data).value * FinancingCalculator.getNotaryFeesRate();

const calculateProjectValue = data =>
  getProperty(data).value * (1 + FinancingCalculator.getNotaryFeesRate())
  + data.structure.propertyWork;

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
        id: 'notaryFees',
        Component: CalculatedValue,
        value: calculateNotaryFees,
      },
      { Component: InputAndSlider, id: 'propertyWork' },
    ]}
  />
);

export default FinancingStructuresProject;
