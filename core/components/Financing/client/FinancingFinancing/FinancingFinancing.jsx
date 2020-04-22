import React from 'react';

import {
  OWN_FUNDS_USAGE_TYPES,
  PURCHASE_TYPE,
} from '../../../../api/loans/loanConstants';
import Calculator from '../../../../utils/Calculator';
import { createRoute } from '../../../../utils/routerUtils';
import IconButton from '../../../IconButton';
import Link from '../../../Link';
import T from '../../../Translation';
import Calc, { getOffer } from '../FinancingCalculator';
import { getAmortization } from '../FinancingResult/financingResultHelpers';
import FinancingSection, {
  CalculatedValue,
  FinancingField,
} from '../FinancingSection';
import BorrowRatioStatus from '../FinancingSection/components/BorrowRatioStatus';
import FinancingAmortizationDuration from './FinancingAmortizationDuration';
import FinancingLoanValue from './FinancingLoanValue';
import FinancingTranchePicker from './FinancingTranchePicker';
import MortgageNotesPicker from './MortgageNotesPicker';

const getPledgedAmount = ({ structure: { ownFunds } }) =>
  ownFunds
    .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value }) => sum + value, 0);

export const calculateLoan = params => {
  const {
    structure: { wantedLoan },
  } = params;
  return wantedLoan;
};

const calculateMaxLoan = (data, pledgeOverride) => {
  const { loan, structureId } = data;
  const offer = Calculator.selectOffer({ loan, structureId });
  if (offer) {
    const { maxAmount } = getOffer(data);
    return maxAmount;
  }

  const structure = Calculator.selectStructure({ loan, structureId });
  const propertyValue = Calculator.selectPropertyValue({ loan, structureId });

  const maxLoan = Calc.getMaxLoanBase({
    propertyWork: structure.propertyWork,
    propertyValue,
    pledgedAmount:
      pledgeOverride !== undefined ? pledgeOverride : getPledgedAmount(data),
    residenceType: loan.residenceType,
    maxBorrowRatio: Calculator.getMaxBorrowRatio({ loan, structureId }),
  });
  const rounding = 10 ** 3;
  return Math.floor(maxLoan / rounding) * rounding;
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
        // TODO: To be released in the future
        // {
        //   Component: RadioButtons,
        //   id: 'amortizationType',
        //   options: Object.values(AMORTIZATION_TYPE).map(key => ({
        //     id: key,
        //     label: `FinancingFinancing.${key}`,
        //   })),
        //   condition: enableOffers,
        // },
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
      ]}
    />
  );
};

export default FinancingFinancing;
