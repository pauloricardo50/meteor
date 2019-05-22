// @flow
import React from 'react';

type LoanCardProps = {
  loan: Object,
};

const LoanCard = ({ loan = {} }: LoanCardProps) => {
  console.log('loan:', loan);

  return <div className="loancard">{loan.name}</div>;
};

export default LoanCard;
