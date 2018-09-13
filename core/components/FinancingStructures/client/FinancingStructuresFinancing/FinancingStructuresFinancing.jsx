// @flow
import React from 'react';

import {
  AMORTIZATION_TYPE,
  OWN_FUNDS_USAGE_TYPES,
} from '../../../../api/constants';
import T from '../../../Translation';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
  RadioButtons,
  FinmaRatio,
} from '../FinancingStructuresSection';
import Calc, { getProperty } from '../FinancingStructuresCalculator';
import FinancingStructuresTranchePicker from './FinancingStructuresTranchePicker';
import {
  getBorrowRatio,
  getBorrowRatioStatus,
} from '../FinancingStructuresResult/financingStructuresResultHelpers';
import LoanPercent from './LoanPercent';

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
    propertyValue: getProperty(data).value,
    pledgedAmount:
      pledgeOverride !== undefined ? pledgeOverride : getPledgedAmount(data),
    residenceType: data.loan.general.residenceType,
  });

const offersExist = ({ offers }) => offers && offers.length > 0;

type FinancingStructuresFinancingProps = {};

const FinancingStructuresFinancing = (props: FinancingStructuresFinancingProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'mortgageLoan',
        label: (
          <span className="section-title">
            <T id="FinancingStructuresFinancing.title" />
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
          label: `FinancingStructuresFinancing.${key}`,
        })),
        condition: offersExist,
      },
      {
        id: 'loanTranches',
        Component: FinancingStructuresTranchePicker,
        condition: offersExist,
      },
    ]}
  />
);

export default FinancingStructuresFinancing;
