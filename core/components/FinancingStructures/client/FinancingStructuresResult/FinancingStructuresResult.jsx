// @flow
import React from 'react';

import FinancingStructuresSection, {
  CalculatedValue,
} from '../FinancingStructuresSection';

type FinancingStructuresResultProps = {};

const calculateMonthly = () => 1000;
const returnZero = () => 0;

const FinancingStructuresResult = (props: FinancingStructuresResultProps) => (
  <FinancingStructuresSection
    className="result-section"
    summaryConfig={[
      {
        id: 'result',
        label: <h3 className="section-title">Résultat</h3>,
        Component: CalculatedValue,
        value: calculateMonthly,
      },
    ]}
    detailConfig={[
      { id: 'amortization', Component: CalculatedValue, value: returnZero },
      { id: 'interests', Component: CalculatedValue, value: returnZero },
      { id: 'otherCosts', Component: CalculatedValue, value: returnZero },
      { id: 'fiscal', label: <h4>Incidences Fiscales</h4> },
      { id: 'secondPillarTax', Component: CalculatedValue, value: returnZero },
      {
        id: 'amortizationDeduction',
        Component: CalculatedValue,
        value: returnZero,
      },
      { id: 'totalFiscal', Component: CalculatedValue, value: returnZero },
      { id: 'future', label: <h4>Situation future</h4> },
      { id: 'remainingCash', Component: CalculatedValue, value: returnZero },
      {
        id: 'remainingSecondPillar',
        Component: CalculatedValue,
        value: returnZero,
      },
    ]}
  />
);

export default FinancingStructuresResult;
