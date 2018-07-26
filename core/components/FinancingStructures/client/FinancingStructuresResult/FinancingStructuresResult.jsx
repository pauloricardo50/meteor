// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingStructuresSection, {
  CalculatedValue,
} from '../FinancingStructuresSection';
import FinancingStructuresResultChart from './FinancingStructuresResultChart';
import {
  returnZero,
  getInterests,
  getAmortization,
  getAmortizationDeduction,
  getSecondPillarWithdrawalTax,
  getRemainingCash,
  getRemainingSecondPillar,
  getRemainingThirdPillar,
} from './financingStructuresResultHelpers';

type FinancingStructuresResultProps = {};

const FinancingStructuresResult = (props: FinancingStructuresResultProps) => (
  <FinancingStructuresSection
    className="result-section"
    summaryConfig={[
      {
        id: 'result',
        label: (
          <span className="section-title">
            <T id="FinancingStructuresResult.title" />
          </span>
        ),
        Component: FinancingStructuresResultChart,
        getAmortization,
        getInterests,
      },
    ]}
    detailConfig={[
      {
        id: 'amortizationCost',
        Component: CalculatedValue,
        value: getAmortization,
      },
      { id: 'interestsCost', Component: CalculatedValue, value: getInterests },
      {
        id: 'fiscal',
        label: (
          <h4>
            <T id="FinancingStructuresResult.fiscalTitle" />
          </h4>
        ),
        className: 'section-subtitle',
      },
      {
        id: 'secondPillarWithdrawalTax',
        Component: CalculatedValue,
        value: getSecondPillarWithdrawalTax,
      },
      {
        id: 'amortizationDeduction',
        Component: CalculatedValue,
        value: getAmortizationDeduction,
      },
      {
        id: 'totalFiscal',
        Component: CalculatedValue,
        value: params => getSecondPillarWithdrawalTax(params)
          + getAmortizationDeduction(params),
      },
      {
        id: 'future',
        label: (
          <h4>
            <T id="FinancingStructuresResult.future" />
          </h4>
        ),
        className: 'section-subtitle',
      },
      {
        id: 'remainingCash',
        Component: CalculatedValue,
        value: getRemainingCash,
      },
      {
        id: 'remainingSecondPillar',
        Component: CalculatedValue,
        value: getRemainingSecondPillar,
      },
      {
        id: 'remainingThirdPillar',
        Component: CalculatedValue,
        value: getRemainingThirdPillar,
      },
    ]}
  />
);

export default FinancingStructuresResult;
