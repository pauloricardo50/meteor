import React from 'react';

import { PURCHASE_TYPE } from '../../../../api/loans/loanConstants';
import Calculator from '../../../../utils/Calculator';
import T from '../../../Translation';
import FinancingSection, {
  CalculatedValue,
  FinancingField,
} from '../FinancingSection';
import FinancingProjectFees from './FinancingProjectFees';
import FinancingPropertyPicker from './FinancingPropertyPicker';

const MAX_NOTARY_FEES_RATE = 0.1;

const calculateDefaultNotaryFees = data => Calculator.getFees(data).total;

const calculateMaxNotaryFees = data =>
  (Calculator.selectPropertyValue(data) + data.structure.propertyWork) *
  MAX_NOTARY_FEES_RATE;

const FinancingProject = ({ purchaseType }) => (
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
        intlProps: {
          values: { purchaseType },
          tooltip: purchaseType === PURCHASE_TYPE.REFINANCING && (
            <T id="Financing.propertyValue.refinancingTooltip" />
          ),
        },
        calculatePlaceholder: data => Calculator.selectPropertyValue(data),
        max: 100000000,
        allowUndefined: true,
        forceUndefined: true,
      },
      {
        Component: FinancingField,
        id: 'propertyWork',
        max: 10000000,
        condition: purchaseType === PURCHASE_TYPE.ACQUISITION,
      },
      {
        Component: FinancingProjectFees,
        id: 'notaryFees',
        calculatePlaceholder: calculateDefaultNotaryFees,
        max: calculateMaxNotaryFees,
        allowUndefined: true,
      },
    ]}
  />
);

export default FinancingProject;
