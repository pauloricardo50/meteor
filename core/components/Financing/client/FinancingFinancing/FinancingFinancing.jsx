import React from 'react';

import { PURCHASE_TYPE } from '../../../../api/loans/loanConstants';
import Calculator from '../../../../utils/Calculator';
import { toMoney } from '../../../../utils/conversionFunctions';
import { createRoute } from '../../../../utils/routerUtils';
import IconButton from '../../../IconButton';
import Link from '../../../Link';
import T from '../../../Translation';
import FinancingProjectFees from '../FinancingProject/FinancingProjectFees';
import { getAmortization } from '../FinancingResult/financingResultHelpers';
import FinancingSection, {
  CalculatedValue,
  FinancingField,
} from '../FinancingSection';
import BorrowRatioStatus from '../FinancingSection/components/BorrowRatioStatus';
import FinancingAmortizationDuration from './FinancingAmortizationDuration';
import FinancingLoanValue from './FinancingLoanValue';
import FinancingReimbursementPenalty from './FinancingReimbursementPenalty';
import FinancingTranchePicker from './FinancingTranchePicker';
import MortgageNotesPicker from './MortgageNotesPicker';

const MAX_NOTARY_FEES_RATE = 0.1;

export const calculateLoan = params => {
  const {
    structure: { wantedLoan },
  } = params;
  return wantedLoan;
};

const calculateMaxLoan = data => {
  const { loan, structureId } = data;

  return Calculator.getMaxLoanValue({ loan, structureId });
};

const calculateMaxFirstRank = ({ Calculator: calc, ...data }) =>
  calc.getMaxBorrowRatio(data);

const calculateDefaultFirstRank = ({ Calculator: calc, ...data }) => {
  const borrowRatio = calc.getBorrowRatio(data);
  const goal = calc.getAmortizationGoal(data);

  if (borrowRatio <= goal) {
    return borrowRatio;
  }

  return goal;
};

const calculateYearlyAmortizationPlaceholder = data =>
  getAmortization(data) * 12;

const enableOffers = ({ loan }) => loan.enableOffers;

const oneStructureHasLoan = ({ loan: { structures } }) =>
  structures.some(({ wantedLoan }) => wantedLoan);

const oneStructureIncreasesLoan = ({ loan }) => {
  const previousLoan = Calculator.getPreviousLoanValue({ loan });
  return loan.structures.some(({ wantedLoan }) => wantedLoan > previousLoan);
};

const calculateDefaultReimbursementPenalty = data =>
  Calculator.getReimbursementPenalty(data);

const calculateDefaultNotaryFees = data => Calculator.getNotaryFees(data).total;

const calculateMaxNotaryFees = data =>
  (Calculator.selectPropertyValue(data) + data.structure.propertyWork) *
  MAX_NOTARY_FEES_RATE;

const FinancingFinancing = ({ purchaseType }) => {
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;

  return (
    <FinancingSection
      summaryConfig={[
        {
          id: 'mortgageLoan',
          label: (
            <span className="section-title">
              <T id="FinancingFinancing.title" values={{ purchaseType }} />
            </span>
          ),
          Component: props => (
            <div className="mortgageLoan financing-mortgageLoan">
              <CalculatedValue value={calculateLoan} {...props} />
              <BorrowRatioStatus {...props} />
            </div>
          ),
        },
      ]}
      detailConfig={[
        {
          Component: FinancingLoanValue,
          id: 'wantedLoan',
          max: calculateMaxLoan,
          intlProps: {
            value: { purchaseType },
          },
        },
        {
          Component: FinancingField,
          id: 'firstRank',
          type: 'percent',
          max: calculateMaxFirstRank,
          allowUndefined: true,
          calculatePlaceholder: calculateDefaultFirstRank,
        },
        {
          Component: FinancingField,
          id: 'yearlyAmortization',
          allowUndefined: true,
          calculatePlaceholder: calculateYearlyAmortizationPlaceholder,
          getError: ({ value, structure }) => {
            if (value > 0 && structure.firstRank > 0) {
              return <T id="FinancingFinancing.amortizationClash" />;
            }
          },
        },
        {
          Component: FinancingAmortizationDuration,
          id: 'amortizationDuration',
        },
        {
          Component: FinancingField,
          id: 'wantedMortgageNote',
          max: 10000000,
          calculatePlaceholder: calculateLoan,
          min: calculateLoan,
          allowUndefined: true,
          condition: !isRefinancing,
        },
        {
          Component: MortgageNotesPicker,
          id: 'existingMortgageNotes',
          condition: oneStructureHasLoan,
        },
        {
          id: 'loanTranches',
          Component: FinancingTranchePicker,
          condition: enableOffers,
        },
        {
          id: 'previousLoanValue',
          Component: props => (
            <span className="flex center-align previousLoanValue">
              <CalculatedValue {...props} />
              <Link
                to={createRoute('/loans/:loanId/refinancing', {
                  loanId: props.loan._id,
                })}
              >
                <IconButton type="edit" size="small" className="ml-8" />
              </Link>
            </span>
          ),
          condition: isRefinancing,
          value: Calculator.getPreviousLoanValue,
          className: 'flex-col previousLoanValue',
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
                  values={{ isMissingOwnFunds: value > 0 }}
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
      ]}
    />
  );
};

export default FinancingFinancing;
