// @flow
import React from 'react';
import { T } from 'core/components/Translation/Translation';

type LoanBankTitleProps = {
  title: String,
  purchaseType: String,
  residenceType: String,
};

const LoanBankTitle = ({
  title,
  purchaseType,
  residenceType,
}: LoanBankTitleProps) => (
  <div className="loan-bank-pdf-title">
    <h1>{title}</h1>
    <h2>
      <T id={`PDF.purchaseType.${purchaseType}`} />
      {' - '}
      <T id={`PDF.residenceType.${residenceType}`} />
    </h2>
  </div>
);

export default LoanBankTitle;
