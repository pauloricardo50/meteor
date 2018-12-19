// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingSection';
import FinancingPropertyPicker from './FinancingPropertyPicker';
import { getProperty } from '../FinancingCalculator';
import { getPropertyValue } from '../FinancingOwnFunds/ownFundsHelpers';
import FinancingProjectFees from './FinancingProjectFees';
import Calculator from '../../../../utils/Calculator';

type FinancingProjectProps = {};

const MAX_NOTARY_FEES_RATE = 0.1;

const calculateDefaultNotaryFees = data => Calculator.getFees(data).total;

const calculateMaxNotaryFees = data =>
  (getPropertyValue(data) + data.structure.propertyWork) * MAX_NOTARY_FEES_RATE;

const calculateProjectValue = data =>
  getPropertyValue(data)
  + data.structure.propertyWork
  + Calculator.getFees(data).total;

const FinancingProject = (props: FinancingProjectProps) => (
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
        value: calculateProjectValue,
      },
    ]}
    detailConfig={[
      { Component: FinancingPropertyPicker, id: 'propertyId' },
      {
        Component: InputAndSlider,
        id: 'propertyValue',
        calculatePlaceholder: data => getProperty(data).value,
        max: 5000000,
        allowUndefined: true,
        forceUndefined: true,
      },
      {
        Component: FinancingProjectFees,
        id: 'notaryFees',
        calculatePlaceholder: calculateDefaultNotaryFees,
        max: calculateMaxNotaryFees,
        allowUndefined: true,
      },
      { Component: InputAndSlider, id: 'propertyWork' },
    ]}
  />
);

export default FinancingProject;
