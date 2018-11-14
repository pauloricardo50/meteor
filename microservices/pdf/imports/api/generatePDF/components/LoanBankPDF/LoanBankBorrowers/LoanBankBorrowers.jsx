// @flow
import React from 'react';
import BorrowersRecap from './BorrowersRecap';

type LoanBankBorrowersProps = {
  borrowers: Array<Object>,
};

const LoanBankBorrowers = ({ borrowers }: LoanBankBorrowersProps) => (
  <BorrowersRecap borrowers={borrowers} twoBorrowers={borrowers.length > 1} />
);

export default LoanBankBorrowers;
