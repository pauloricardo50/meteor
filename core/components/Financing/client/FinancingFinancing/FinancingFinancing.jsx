// @flow
import React from 'react';

import {
  AMORTIZATION_TYPE,
  OWN_FUNDS_USAGE_TYPES,
} from '../../../../api/constants';
import T from '../../../Translation';
import FinancingSection, {
  InputAndSlider,
  CalculatedValue,
  RadioButtons,
  FinmaRatio,
} from '../FinancingSection';
import Calc, { getOffer } from '../FinancingCalculator';
import FinancingTranchePicker from './FinancingTranchePicker';
import {
  getBorrowRatio,
  getBorrowRatioStatus,
} from '../FinancingResult/financingResultHelpers';
import LoanPercent from './LoanPercent';
import { getPropertyValue } from '../FinancingOwnFunds/ownFundsHelpers';

const getPledgedAmount = ({ structure: { ownFunds } }) =>
  ownFunds
    .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value }) => sum + value, 0);

export const calculateLoan = (params) => {
  const {
    structure: { wantedLoan },
  } = params;
  return wantedLoan;
};

export const calculateMaxLoan = (data, pledgeOverride) => {
  if (data.structure.offerId) {
    const { maxAmount } = getOffer(data);
    return maxAmount;
  }

  return Calc.getMaxLoanBase({
    propertyWork: data.structure.propertyWork,
    propertyValue: getPropertyValue(data),
    pledgedAmount:
      pledgeOverride !== undefined ? pledgeOverride : getPledgedAmount(data),
    residenceType: data.loan.general.residenceType,
  });
};

const enableOffers = ({ loan }) => loan.enableOffers;

type FinancingFinancingProps = {};

const FinancingFinancing = (props: FinancingFinancingProps) => (
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
            <FinmaRatio
              value={getBorrowRatio}
              status={getBorrowRatioStatus}
              {...props}
            />
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
