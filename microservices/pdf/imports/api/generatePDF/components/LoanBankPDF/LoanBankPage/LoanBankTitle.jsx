// @flow
import React from 'react';

type LoanBankTitleProps = {
  title: String,
  subtitle: String,
};

const LoanBankTitle = ({ title, subtitle }: LoanBankTitleProps) => (
  <div className="title">
    <h1>{title}</h1>
    <h2>{subtitle}</h2>
  </div>
);

export default LoanBankTitle;
