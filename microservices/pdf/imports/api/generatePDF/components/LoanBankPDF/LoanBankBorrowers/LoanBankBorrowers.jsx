// @flow
import React from 'react';
import { GENDER } from 'core/api/constants';
import Recap from 'core/components/Recap';
import { T } from 'core/components/Translation/Translation';

type LoanBankBorrowersProps = {
  borrowers: Array<Object>,
};

const LoanBankBorrowers = ({ borrowers }: LoanBankBorrowersProps) => (
  <div className="loan-bank-pdf-borrowers">
    <h3 className="loan-bank-pdf-section-title">
      {borrowers.length > 1 ? (
        <T id="PDF.sectionTitle.borrowers" />
      ) : (
        <T id="PDF.sectionTitle.borrower" />
      )}
    </h3>
    <div className="loan-bank-pdf-borrowers-recap">
      {borrowers.map(borrower => (
        <div
          key={borrower._id}
          className="loan-bank-pdf-borrowers-recap-single"
        >
          <h3>
            {borrower.gender === GENDER.M ? (
              <T id="PDF.mister" />
            ) : (
              <T id="PDF.madam" />
            )}
          </h3>
          <Recap arrayName="borrower" borrower={borrower} />
        </div>
      ))}
    </div>
  </div>
);

export default LoanBankBorrowers;
