import React from 'react';

import { PURCHASE_TYPE } from '../../../../api/loans/loanConstants';
import Calculator from '../../../../utils/Calculator';
import { toMoney } from '../../../../utils/conversionFunctions';
import Tooltip from '../../../Material/Tooltip';
import T from '../../../Translation';
import FinancingProjectFees from '../FinancingProject/FinancingProjectFees';
import FinancingSection, { CalculatedValue } from '../FinancingSection';
import { FORMATS } from '../FinancingSection/components/CalculatedValue';
import FinancingOwnFundsPicker from './FinancingOwnFundsPicker';
import FinancingOwnFundsStatus from './FinancingOwnFundsStatus';
import FinancingReimbursementPenalty from './FinancingReimbursementPenalty';
import RequiredOwnFunds from './RequiredOwnFunds';

const MAX_NOTARY_FEES_RATE = 0.1;

const feesTooltip = props => {
  const value = Calculator.getNotaryFeesTooltipValue(props);

  if (value) {
    return (
      <Tooltip title={`Frais de notaire: CHF ${toMoney(value)}`}>
        <span>&nbsp;+ frais</span>
      </Tooltip>
    );
  }

  return null;
};

const calculateDefaultNotaryFees = data => Calculator.getFees(data).total;

const calculateMaxNotaryFees = data =>
  (Calculator.selectPropertyValue(data) + data.structure.propertyWork) *
  MAX_NOTARY_FEES_RATE;

const getLoanEvolution = ({ loan, structure: { wantedLoan } }) =>
  wantedLoan - Calculator.getPreviousLoanValue({ loan });

const calculateDefaultReimbursementPenalty = data =>
  Calculator.getReimbursementPenalty(data);

const FinancingOwnFunds = props => {
  const { purchaseType } = props;
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;

  return (
    <FinancingSection
      summaryConfig={[
        {
          id: 'ownFunds',
          label: (
            <span className="section-title">
              <T id="FinancingOwnFunds.title" />
            </span>
          ),
          Component: props => (
            <div className="financing-ownFunds-summary ownFunds">
              {isRefinancing ? (
                <CalculatedValue
                  value={Calculator.getReimbursementRequiredOwnFunds}
                  children={value => (
                    <div className="flex-col center">
                      <T
                        id="Financing.reimbursementRequiredOwnFunds.description"
                        values={{ isMissingOwnFunds: value < 0 }}
                        style={{ color: '#444444' }}
                      />
                      <span>
                        <span className="chf">CHF</span>
                        {toMoney(Math.abs(value))}
                      </span>
                    </div>
                  )}
                  {...props}
                />
              ) : (
                <>
                  <CalculatedValue
                    value={Calculator.getNonPledgedOwnFunds}
                    {...props}
                  />
                  <div className="flex-row center">
                    <CalculatedValue
                      value={Calculator.getOwnFundsRatio}
                      format={FORMATS.PERCENT}
                      {...props}
                    />
                    {feesTooltip(props)}
                    <FinancingOwnFundsStatus
                      value={Calculator.getMissingOwnFunds(props)}
                      {...props}
                    />
                  </div>
                </>
              )}
            </div>
          ),
        },
      ]}
      detailConfig={[
        {
          id: 'ownFundsLoanEvolution',
          Component: CalculatedValue,
          condition: isRefinancing,
          value: getLoanEvolution,
          className: 'flex-col center ownFundsLoanEvolution',
          children: value => (
            <div className="flex-col center">
              <b style={{ color: '#444444' }}>
                <T
                  id="Financing.loanEvolution.description"
                  values={{ isLoanIncreased: value > 0 }}
                />
              </b>
              <span>
                <span className="chf">CHF</span>
                {toMoney(Math.abs(value))}
              </span>
            </div>
          ),
        },
        {
          Component: FinancingReimbursementPenalty,
          id: 'reimbursementPenalty',
          calculatePlaceholder: calculateDefaultReimbursementPenalty,
          allowUndefined: true,
          condition: isRefinancing,
        },
        {
          Component: FinancingProjectFees,
          id: 'notaryFees',
          calculatePlaceholder: calculateDefaultNotaryFees,
          max: calculateMaxNotaryFees,
          allowUndefined: true,
          condition: isRefinancing,
        },
        {
          id: 'reimbursementRequiredOwnFunds',
          Component: CalculatedValue,
          condition: isRefinancing,
          value: Calculator.getReimbursementRequiredOwnFunds,
          className: 'flex-col center reimbursementRequiredOwnFunds',
          children: value => (
            <div className="flex-col center">
              <b style={{ color: '#444444' }}>
                <T
                  id="Financing.reimbursementRequiredOwnFunds.description"
                  values={{ isMissingOwnFunds: value < 0 }}
                />
              </b>
              <span>
                <span className="chf">CHF</span>
                {toMoney(Math.abs(value))}
              </span>
            </div>
          ),
        },
        {
          Component: RequiredOwnFunds,
          id: 'requiredOwnFunds',
          calculateValue: Calculator.getMissingOwnFunds,
          condition: !isRefinancing,
        },
        {
          Component: FinancingOwnFundsPicker,
          id: 'ownFundsPicker',
          condition: !isRefinancing,
        },
      ]}
    />
  );
};

export default FinancingOwnFunds;
