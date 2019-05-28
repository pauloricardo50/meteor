// @flow
import React from 'react';

import LoanCard from './LoanCard';

type LoanCardsProps = {
  loans: Array<Object>,
};

const LoanCards = ({ loans = [] }: LoanCardsProps) => (
  <div className="loan-cards">
    {loans.map(loan => (
      <LoanCard loan={loan} key={loan._id} />
    ))}
  </div>
);

export default LoanCards;
