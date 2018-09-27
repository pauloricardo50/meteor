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
import Calc from '../FinancingCalculator';
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

export const calculateMaxLoan = (data, pledgeOverride) =>
  Calc.getMaxLoanBase({
    propertyWork: data.structure.propertyWork,
    propertyValue: getPropertyValue(data),
    pledgedAmount:
      pledgeOverride !== undefined ? pledgeOverride : getPledgedAmount(data),
    residenceType: data.loan.general.residenceType,
  });

const offersExist = ({ offers }) => offers && offers.length > 0;

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
      {
        Component: RadioButtons,
        id: 'amortizationType',
        options: Object.values(AMORTIZATION_TYPE).map(key => ({
          id: key,
          label: `FinancingFinancing.${key}`,
        })),
        condition: offersExist,
      },
      {
        id: 'loanTranches',
        Component: FinancingTranchePicker,
        condition: offersExist,
      },
    ]}
  />
);

export default FinancingFinancing;
