// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingStructuresSection';
import FinancingStructuresPropertyPicker from './FinancingStructuresPropertyPicker';
import { makeSelectPropertyValue } from '../../../../redux/financingStructures';

type FinancingStructuresProjectProps = {};

const calculateNotaryFees = ({ structure: { id }, ...financingStructures }) => makeSelectPropertyValue(id)({ financingStructures }) * 0.05;

const calculateProjectValue = ({
  structure: { id, propertyWork },
  ...financingStructures
}) => makeSelectPropertyValue(id)({ financingStructures }) * 1.05 + propertyWork;

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
