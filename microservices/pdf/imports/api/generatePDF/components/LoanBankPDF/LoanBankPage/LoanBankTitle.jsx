// @flow
import React from 'react';
import { T } from 'core/components/Translation/Translation';

type LoanBankTitleProps = {
  purchaseType: String,
  residenceType: String,
};

const LoanBankTitle = ({ purchaseType, residenceType }: LoanBankTitleProps) => (
  <div className="loan-bank-pdf-title">
    <h1>
      <T id={`PDF.purchaseType.${purchaseType}`} />
    </h1>
    <h2>
      <T id={`PDF.residenceType.${residenceType}`} />
    </h2>
  </div>
);

export default LoanBankTitle;
