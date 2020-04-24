import React from 'react';

import { PURCHASE_TYPE } from '../../../../api/loans/loanConstants';
import Calculator from '../../../../utils/Calculator';
import { toMoney } from '../../../../utils/conversionFunctions';
import Tooltip from '../../../Material/Tooltip';
import T from '../../../Translation';
import FinancingProjectFees from '../FinancingProject/FinancingProjectFees';
import FinancingSection, {
  CalculatedValue,
  FinancingField,
} from '../FinancingSection';
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

const calculateDefaultNotaryFees = data => Calculator.getNotaryFees(data).total;

const calculateMaxNotaryFees = data =>
  (Calculator.selectPropertyValue(data) + data.structure.propertyWork) *
  MAX_NOTARY_FEES_RATE;

const getLoanEvolution = ({ loan, structure: { wantedLoan } }) =>
  wantedLoan - Calculator.getPreviousLoanValue({ loan });

const calculateDefaultReimbursementPenalty = data =>
  Calculator.getReimbursementPenalty(data);

const oneStructureIncreasesLoan = ({ loan }) => {
  const previousLoan = Calculator.getPreviousLoanValue({ loan });
  return loan.structures.some(({ wantedLoan }) => wantedLoan > previousLoan);
};

const oneStructureDecreasesLoan = ({ loan }) => {
  const previousLoan = Calculator.getPreviousLoanValue({ loan });
  return loan.structures.some(({ wantedLoan }) => wantedLoan < previousLoan);
};

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
                  value={Calculator.getRefinancingRequiredOwnFunds}
                  {...props}
                >
                  {value => (
                    <div className="flex-col center">
                      <span style={{ color: '#444444', marginBottom: 8 }}>
                        <T
                          id="Financing.reimbursementRequiredOwnFunds.description"
                          values={{ isMissingOwnFunds: value < 0 }}
                        />
                      </span>
                      <span>
                        <span className="chf">CHF</span>
                        {toMoney(Math.abs(value))}
                      </span>
                    </div>
                  )}
                </CalculatedValue>
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
          className: 'flex-col ownFundsLoanEvolution',
          children: value => (
            <div className="flex-col mb-8">
              <b style={{ color: '#444444', marginBottom: 4 }}>
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
          value: Calculator.getRefinancingRequiredOwnFunds,
          className: 'flex-col reimbursementRequiredOwnFunds',
          children: value => (
            <div className="flex-col" style={{ marginTop: 8, marginBottom: 8 }}>
              <b style={{ color: '#444444', marginBottom: 4 }}>
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
          Component: FinancingField,
          id: 'ownFundsUseDescription',
          condition: p => isRefinancing && oneStructureIncreasesLoan(p),
          type: 'text',
          multiline: true,
          rows: 2,
          allowUndefined: true,
          placeholder: 'Financing.ownFundsUseDescription.placeholder',
          noIntl: true,
        },
        {
          Component: FinancingOwnFundsPicker,
          id: 'ownFundsPicker',
          condition: p => !isRefinancing || oneStructureDecreasesLoan(p),
        },
      ]}
    />
  );
};

export default FinancingOwnFunds;
