import React from 'react';

import { OWN_FUNDS_TYPES } from '../../../../api/borrowers/borrowerConstants';
import T from '../../../Translation';
import FinancingSection, { FinmaRatio } from '../FinancingSection';
import BorrowRatioStatus from '../FinancingSection/components/BorrowRatioStatus';
import FinancingPropertyExpenses from './FinancingPropertyExpenses';
import FinancingResultAmortization from './FinancingResultAmortization';
import {
  FinancingResultFutureTitle,
  FinancingResultFutureValue,
} from './FinancingResultFuture';
import {
  getAmortization,
  getIncomeRatio,
  getIncomeRatioStatus,
  getInterests,
  getRemainingBank3A,
  getRemainingCash,
  getRemainingInsurance2,
  getRemainingInsurance3A,
  getRemainingInsurance3B,
  makeHasOwnFundsOfType,
} from './financingResultHelpers';
import FinancingResultInterests from './FinancingResultInterests';
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
          id: 'monthlyPropertyCost',
          Component: FinancingPropertyExpenses,
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
          id: 'spacing',
          label: <span />,
        },
        {
          id: 'future',
          label: (
            <h4 className="future">
              <T id="FinancingResult.future" />
            </h4>
          ),
          Component: FinancingResultFutureTitle,
        },
        {
          id: 'remainingCash',
          Component: FinancingResultFutureValue,
          value: getRemainingCash,
        },
        {
          id: 'remainingInsurance2',
          Component: FinancingResultFutureValue,
          value: getRemainingInsurance2,
          condition: makeHasOwnFundsOfType(OWN_FUNDS_TYPES.INSURANCE_2),
        },
        {
          id: 'remainingInsurance3A',
          Component: FinancingResultFutureValue,
          value: getRemainingInsurance3A,
          condition: makeHasOwnFundsOfType(OWN_FUNDS_TYPES.INSURANCE_3A),
        },
        {
          id: 'remainingBank3A',
          Component: FinancingResultFutureValue,
          value: getRemainingBank3A,
          condition: makeHasOwnFundsOfType(OWN_FUNDS_TYPES.BANK_3A),
        },
        {
          id: 'remainingInsurance3B',
          Component: FinancingResultFutureValue,
          value: getRemainingInsurance3B,
          condition: makeHasOwnFundsOfType(OWN_FUNDS_TYPES.INSURANCE_3B),
        },
      ]}
    />
  );

export default React.memo(FinancingResult);
