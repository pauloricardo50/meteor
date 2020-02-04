//      
import React from 'react';

import { OWN_FUNDS_USAGE_TYPES } from '../../../../api/constants';
import T from '../../../Translation';
import FinancingSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingSection';
import Calc, { getOffer } from '../FinancingCalculator';
import FinancingTranchePicker from './FinancingTranchePicker';
import MortgageNotesPicker from './MortgageNotesPicker';
import LoanPercent from './LoanPercent';
import Calculator from '../../../../utils/Calculator';
import BorrowRatioStatus from '../FinancingSection/components/BorrowRatioStatus';

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

export const calculateMaxLoan = (data, pledgeOverride) => {
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

const enableOffers = ({ loan }) => loan.enableOffers;

const oneStructureHasLoan = ({ loan: { structures } }) =>
  structures.some(({ wantedLoan }) => wantedLoan);

                                  

const FinancingFinancing = (props                         ) => (
  <FinancingSection
    summaryConfig={[
      {
        id: 'mortgageLoan',
        label: (
          <span className="section-title">
            <T id="FinancingFinancing.title" />
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
        Component: InputAndSlider,
        id: 'wantedLoan',
        max: calculateMaxLoan,
      },
      {
        Component: LoanPercent,
        id: 'wantedLoanPercent',
      },
      {
        Component: MortgageNotesPicker,
        id: 'mortgageNoteIds',
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
    ]}
  />
);

export default FinancingFinancing;
