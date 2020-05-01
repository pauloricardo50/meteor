import React from 'react';

import { PURCHASE_TYPE } from '../../../../api/loans/loanConstants';
import Calculator from '../../../../utils/Calculator';
import T from '../../../Translation';
import FinancingSection from '../FinancingSection';
import FinancingOwnFundsPicker from './FinancingOwnFundsPicker';
import FinancingOwnFundsTitle from './FinancingOwnFundsTitle';
import RequiredOwnFunds from './RequiredOwnFunds';

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
          Component: FinancingOwnFundsTitle,
        },
      ]}
      detailConfig={[
        {
          Component: RequiredOwnFunds,
          id: 'requiredOwnFunds',
          calculateValue: Calculator.getMissingOwnFunds,
          // condition: !isRefinancing,
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
