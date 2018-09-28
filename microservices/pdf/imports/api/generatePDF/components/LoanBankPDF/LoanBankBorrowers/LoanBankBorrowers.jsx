// @flow
import React from 'react';
import BorrowersRecap from './BorrowersRecap';

type LoanBankBorrowersProps = {
  borrowers: Array<Object>,
};

const LoanBankBorrowers = ({ borrowers }: LoanBankBorrowersProps) => (
  <div className="loan-bank-pdf-borrowers">
    <BorrowersRecap borrowers={borrowers} />
  </div>
);

export default LoanBankBorrowers;
