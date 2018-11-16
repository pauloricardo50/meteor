// @flow
import React from 'react';

import T from 'core/components/Translation';
import BorrowersRecap from './BorrowersRecap';
import PdfPage from '../../PdfPage';

type LoanBankBorrowersProps = {
  borrowers: Array<Object>,
};

const LoanBankBorrowers = ({ loan: { borrowers } }: LoanBankBorrowersProps) => (
  <PdfPage
    className="borrowers-page"
    isLast
    title={<T id="PDF.title.borrowers" />}
  >
    <BorrowersRecap borrowers={borrowers} twoBorrowers={borrowers.length > 1} />
  </PdfPage>
);

export default LoanBankBorrowers;
