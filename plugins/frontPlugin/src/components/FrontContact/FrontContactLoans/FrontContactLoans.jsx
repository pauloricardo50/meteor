import React from 'react';
import LoanCard from './LoanCard';

const FrontContactLoans = ({ loans = [] }) =>
  loans.map(loan => (
    <LoanCard key={loan._id} loan={loan} expanded={loans.length === 1} />
  ));

export default FrontContactLoans;
