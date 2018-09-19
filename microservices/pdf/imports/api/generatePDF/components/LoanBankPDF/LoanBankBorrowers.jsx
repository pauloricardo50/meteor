// @flow
import React from 'react';
import Recap from '../../../../core/components/Recap/Recap';

type LoanBankBorrowersProps = {
  borrowers: Array<Object>,
};

const LoanBankBorrowers = ({ borrowers }: LoanBankBorrowersProps) => (
  <div className="loan-bank-pdf-borrowers">
    <h3>Emprunteurs</h3>
    <div className="loan-bank-pdf-borrowers-recap">
      {borrowers.map(borrower => (
        <Recap arrayName="borrower" borrower={borrower} />
      ))}
    </div>
  </div>
);

export default LoanBankBorrowers;
