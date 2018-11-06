// @flow
import React from 'react';

type LoanBankTitleProps = {
  title: String,
  subtitle: String,
};

const LoanBankTitle = ({ title, subtitle }: LoanBankTitleProps) => {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <div className="page-title">
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </div>
  );
};

export default LoanBankTitle;
