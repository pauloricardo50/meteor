import { Meteor } from 'meteor/meteor';

import React from 'react';

import { OWN_FUNDS_TYPES } from '../../../../api/borrowers/borrowerConstants';
import Icon from '../../../Icon';
import LenderRulesRecap from '../../../LenderRulesRecap/LenderRulesRecap';
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
          id: 'lender-rules',
          label: "[ADMIN] Critères d'octroi",
          condition: () => Meteor.microservice === 'admin',
          Component: ({ loan, structureId }) => (
            <span className="lender-rules">
              <Icon
                type="info"
                tooltip={
                  <LenderRulesRecap loan={loan} structureId={structureId} />
                }
              />
            </span>
          ),
        },
        {
          id: 'cost-title',
          label: (
            <h4 className="font-size-5">
              <T id="FinancingResult.cost" />
            </h4>
          ),
          Component: () => <span className="cost-title" />,
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
          id: 'spacing',
          label: <span />,
        },
        {
          id: 'finma-title',
          label: (
            <h4 className="font-size-5">
              <T id="FinancingResult.finma" />
            </h4>
          ),
          Component: () => <span className="finma-title" />,
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
            <h4 className="future font-size-5">
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
