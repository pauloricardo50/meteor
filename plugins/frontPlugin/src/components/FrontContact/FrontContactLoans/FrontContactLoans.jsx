import React from 'react';
import LoanCard from './LoanCard';

const FrontContactLoans = ({ loans = [], refetch }) =>
  loans.map(loan => (
    <LoanCard
      key={loan._id}
      loan={loan}
      expanded={loans.length === 1}
      refetch={refetch}
    />
  ));

export default FrontContactLoans;
