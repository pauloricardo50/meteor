// @flow
import React from 'react';

type LoanBankFooterProps = {
  pageNumber: Number,
};

const LoanBankFooter = ({ pageNumber }: LoanBankFooterProps) => (
  <div className="footer pdf-footer">
    <p>{pageNumber}</p>
  </div>
);

export default LoanBankFooter;
