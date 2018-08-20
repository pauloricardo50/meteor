// @flow
import React from 'react';

import T from 'core/components/Translation';
import { lifecycle } from 'recompose';
import FinancingStructuresSection, {
  CalculatedValue,
  FinmaRatio,
} from '../FinancingStructuresSection';
import FinancingStructuresResultErrors from './FinancingStructuresResultErrors';
import {
  getInterests,
  getAmortization,
  getRemainingCash,
  getRemainingSecondPillar,
  getRemainingThirdPillar,
  getPropertyExpenses,
  getBorrowRatio,
  getIncomeRatio,
  getBorrowRatioStatus,
  getIncomeRatioStatus,
} from './financingStructuresResultHelpers';

type FinancingStructuresResultProps = {};

const FinancingStructuresResult = ({ error }: FinancingStructuresResultProps) =>
  (error ? (
    <h3 className="error">{error.message}</h3>
  ) : (
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
          Component: FinancingStructuresResultErrors,
        },
      ]}
      detailConfig={[
        {
          id: 'interestsCost',
          Component: CalculatedValue,
          value: getInterests,
        },
        {
          id: 'amortizationCost',
          Component: CalculatedValue,
          value: getAmortization,
        },
        {
          id: 'propertyCost',
          Component: CalculatedValue,
          value: getPropertyExpenses,
        },
        {
          id: 'finma',
          label: (
            <h4>
              <T id="FinancingStructuresResult.finma" />
            </h4>
          ),
          className: 'section-subtitle',
        },
        {
          id: 'borrowRatio',
          Component: FinmaRatio,
          value: getBorrowRatio,
          status: getBorrowRatioStatus,
        },
        {
          id: 'incomeRatio',
          Component: FinmaRatio,
          value: getIncomeRatio,
          status: getIncomeRatioStatus,
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
  ));

export default lifecycle({
  componentDidCatch(error) {
    this.setState({ error });
  },
  componentWillReceiveProps() {
    this.setState({ error: null });
  },
})(FinancingStructuresResult);
