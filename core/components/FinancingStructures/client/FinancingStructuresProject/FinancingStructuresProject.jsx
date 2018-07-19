// @flow
import React from 'react';

import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingStructuresSection';

type FinancingStructuresProjectProps = {};

const calculateNotaryFees = ({ structure: { propertyValue } }) =>
  propertyValue * 0.05;

const calculateProjectValue = ({
  structure: { propertyValue, propertyWork },
}) => propertyValue * 1.05 + propertyWork;

const FinancingStructuresProject = (props: FinancingStructuresProjectProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'project',
        label: <h3 className="section-title">Projet</h3>,
        Component: CalculatedValue,
        value: calculateProjectValue,
      },
    ]}
    detailConfig={[
      { Component: InputAndSlider, id: 'propertyValue' },
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
