// @flow
import React from 'react';

type LoanBankFooterProps = {
  pageNumber: Number,
};

const LoanBankFooter = ({ pageNumber }: LoanBankFooterProps) => (
  <div className="loan-bank-pdf-footer">{pageNumber}</div>
);

export default LoanBankFooter;
