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

const calculateMaxSliderLoan = data =>
  Calc.getMaxLoanBase({
    propertyWork: data.structure.propertyWork,
    propertyValue: getProperty(data).value,
    pledgedAmount: getPledgedAmount(data),
    residenceType: data.loan.general.residenceType,
  });

const oneStructureHasPledged = ({ structures }) =>
  structures.some(({ secondPillarPledged, thirdPillarPledged }) =>
    secondPillarPledged || thirdPillarPledged);

const offersExist = ({ offers }) => offers && offers.length > 0;

const oneStructureHasPledgedAmount = ({ structures }) =>
  structures.some(({ secondPillarPledged, thirdPillarPledged }) =>
    secondPillarPledged || thirdPillarPledged);

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
        max: calculateMaxSliderLoan,
      },
      {
        Component: LoanPercent,
        id: 'wantedLoanPercent',
        // max: calculateMaxSliderLoan,
      },
      {
        Component: CalculatedValue,
        id: 'pledgedAmount',
        value: getPledgedAmount,
        condition: oneStructureHasPledgedAmount,
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
