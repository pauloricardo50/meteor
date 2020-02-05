//
import React from 'react';

import LoanCard from './LoanCard';

const LoanCards = ({ loans = [] }) => (
  <div className="loan-cards">
    {loans.map(loan => (
      <LoanCard loan={loan} key={loan._id} />
    ))}
  </div>
);

export default LoanCards;
