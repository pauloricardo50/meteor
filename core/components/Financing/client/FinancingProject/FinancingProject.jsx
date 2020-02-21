import React from 'react';

import T from 'core/components/Translation';
import FinancingSection, {
  FinancingField,
  CalculatedValue,
} from '../FinancingSection';
import FinancingPropertyPicker from './FinancingPropertyPicker';
import FinancingProjectFees from './FinancingProjectFees';
import Calculator from '../../../../utils/Calculator';

const MAX_NOTARY_FEES_RATE = 0.1;

const calculateDefaultNotaryFees = data => Calculator.getFees(data).total;

const calculateMaxNotaryFees = data =>
  (Calculator.selectPropertyValue(data) + data.structure.propertyWork) *
  MAX_NOTARY_FEES_RATE;

const FinancingProject = props => (
  <FinancingSection
    summaryConfig={[
      {
        id: 'project',
        label: (
          <span className="section-title">
            <T id="FinancingProject.title" />
          </span>
        ),
        Component: CalculatedValue,
        value: Calculator.getProjectValue,
      },
    ]}
    detailConfig={[
      { Component: FinancingPropertyPicker, id: 'propertyId' },
      {
        Component: FinancingField,
        id: 'propertyValue',
        calculatePlaceholder: data => Calculator.selectPropertyValue(data),
        max: 100000000,
        allowUndefined: true,
        forceUndefined: true,
        maxSlider: 5000000,
      },
      {
        Component: FinancingProjectFees,
        id: 'notaryFees',
        calculatePlaceholder: calculateDefaultNotaryFees,
        max: calculateMaxNotaryFees,
        allowUndefined: true,
      },
      {
        Component: FinancingField,
        id: 'propertyWork',
        max: 10000000,
        maxSlider: 1000000,
      },
    ]}
  />
);

export default FinancingProject;
