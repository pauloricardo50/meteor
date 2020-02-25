import React from 'react';

import T from '../../../Translation';
import { OWN_FUNDS_TYPES } from '../../../../api/constants';
import FinancingSection, {
  CalculatedValue,
  FinmaRatio,
} from '../FinancingSection';
import {
  getInterests,
  getAmortization,
  getRemainingCash,
  getRemainingInsurance2,
  getRemainingInsurance3A,
  getRemainingBank3A,
  getRemainingInsurance3B,
  getPropertyExpenses,
  getIncomeRatio,
  getIncomeRatioStatus,
  makeHasOwnFundsOfType,
} from './financingResultHelpers';
import FinancingResultInterests from './FinancingResultInterests';
import FinancingResultAmortization from './FinancingResultAmortization';
import BorrowRatioStatus from '../FinancingSection/components/BorrowRatioStatus';
import FinancingResultSummary from './FinancingResultSummary';

const FinancingResult = ({ error }) =>
  error ? (
    <h3 className="error">{error.message}</h3>
  ) : (
    <FinancingSection
      className="result-section"
      summaryConfig={[
        {
          id: 'result',
          label: (
            <span className="section-title result">
              <T id="FinancingResult.title" />
            </span>
          ),
          Component: FinancingResultSummary,
        },
      ]}
      detailConfig={[
        {
          id: 'cost',
          label: (
            <h4 className="section-subtitle">
              <T id="FinancingResult.cost" />
            </h4>
          ),
        },
        {
          id: 'interestsCost',
          Component: FinancingResultInterests,
          value: getInterests,
        },
        {
          id: 'amortizationCost',
          Component: FinancingResultAmortization,
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
              <T id="FinancingResult.finma" />
            </h4>
          ),
        },
        {
          id: 'borrowRatio',
          Component: BorrowRatioStatus,
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
              <T id="FinancingResult.future" />
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
  );

export default React.memo(FinancingResult);
