import React from 'react';

import FinancingField from '../FinancingSection/components/FinancingField';
import LoanPercent from './LoanPercent';

const FinancingLoanValue = props => (
  <div className="wantedLoan">
    <FinancingField {...props} />
    <LoanPercent {...props} />
  </div>
);

export default FinancingLoanValue;
