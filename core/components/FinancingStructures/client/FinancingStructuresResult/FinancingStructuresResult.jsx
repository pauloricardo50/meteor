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
  getRemainingInsurance2,
  getRemainingInsurance3A,
  getRemainingBank3A,
  getRemainingInsurance3B,
  getPropertyExpenses,
  getBorrowRatio,
  getIncomeRatio,
  getBorrowRatioStatus,
  getIncomeRatioStatus,
  makeHasOwnFundsOfType,
} from './financingStructuresResultHelpers';
import { OWN_FUNDS_TYPES } from '../../../../api/constants';

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
            <span className="section-title result">
              <T id="FinancingStructuresResult.title" />
            </span>
          ),
          Component: FinancingStructuresResultErrors,
        },
      ]}
      detailConfig={[
        {
          id: 'cost',
          label: (
            <h4 className="section-subtitle">
              <T id="FinancingStructuresResult.cost" />
            </h4>
          ),
        },
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
            <h4 className="section-subtitle">
              <T id="FinancingStructuresResult.finma" />
            </h4>
          ),
        },
        {
          id: 'borrowRatio',
          Component: FinmaRatio,
          value: getBorrowRatio,
          status: getBorrowRatioStatus,
          tooltip: true,
        },
        {
          id: 'incomeRatio',
          Component: FinmaRatio,
          value: getIncomeRatio,
          status: getIncomeRatioStatus,
          tooltip: true,
        },
        {
          id: 'future',
          label: (
            <h4 className="section-subtitle">
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
          id: 'remainingInsurance2',
          Component: CalculatedValue,
          value: getRemainingInsurance2,
          condition: makeHasOwnFundsOfType(OWN_FUNDS_TYPES.INSURANCE_2),
        },
        {
          id: 'remainingInsurance3A',
          Component: CalculatedValue,
          value: getRemainingInsurance3A,
          condition: makeHasOwnFundsOfType(OWN_FUNDS_TYPES.INSURANCE_3A),
        },
        {
          id: 'remainingBank3A',
          Component: CalculatedValue,
          value: getRemainingBank3A,
          condition: makeHasOwnFundsOfType(OWN_FUNDS_TYPES.BANK_3A),
        },
        {
          id: 'remainingInsurance3B',
          Component: CalculatedValue,
          value: getRemainingInsurance3B,
          condition: makeHasOwnFundsOfType(OWN_FUNDS_TYPES.INSURANCE_3B),
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
