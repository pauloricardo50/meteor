import React from 'react';

import Calculator from '../../../../utils/Calculator';
import T from '../../../Translation';
import FinancingSection from '../FinancingSection';
import FinancingOwnFundsPicker from './FinancingOwnFundsPicker';
import FinancingOwnFundsTitle from './FinancingOwnFundsTitle';
import RequiredOwnFunds from './RequiredOwnFunds';

const FinancingOwnFunds = () => (
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
      },
      {
        Component: FinancingOwnFundsPicker,
        id: 'ownFundsPicker',
      },
    ]}
  />
);

export default FinancingOwnFunds;
