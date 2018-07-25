// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinanceCalculator from '../FinancingStructuresCalculator';
import FinancingStructuresSection, {
  CalculatedValue,
} from '../FinancingStructuresSection';
import FinancingStructuresResultChart from './FinancingStructuresResultChart';

type FinancingStructuresResultProps = {};

const returnZero = () => 0;
const getInterests = params => (FinanceCalculator.getInterestsWithTranches(params)
    * params.structure.wantedLoan)
  / 12;
const getAmortization = params => (FinanceCalculator.getAmortizationRate(params)
    * params.structure.wantedLoan)
  / 12;
const getMonthly = params => getInterests(params) + getAmortization(params);

const FinancingStructuresResult = (props: FinancingStructuresResultProps) => (
  <FinancingStructuresSection
    className="result-section"
    summaryConfig={[
      {
        id: 'result',
        label: (
          <h3 className="section-title">
            <T id="FinancingStructuresResult.title" />
          </h3>
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
      },
      {
        id: 'secondPillarWithdrawalTax',
        Component: CalculatedValue,
        value: returnZero,
      },
      {
        id: 'amortizationDeduction',
        Component: CalculatedValue,
        value: returnZero,
      },
      { id: 'totalFiscal', Component: CalculatedValue, value: returnZero },
      {
        id: 'future',
        label: (
          <h4>
            <T id="FinancingStructuresResult.future" />
          </h4>
        ),
      },
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
