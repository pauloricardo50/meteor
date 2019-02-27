// @flow
import React from 'react';

import T from 'core/components/Translation';
import BorrowersRecap from './BorrowersRecap';
import PdfPage from '../../PdfPage';

type LoanBankBorrowersProps = {
  borrowers: Array<Object>,
};

const LoanBankBorrowers = ({
  loan: { borrowers },
  calculator,
  pageNb,
  pageCount,
  options,
}: LoanBankBorrowersProps) => (
  <PdfPage
    className="borrowers-page"
    isLast
    title={<T id="PDF.title.borrowers" />}
    withFooter
    pageNb={pageNb}
    pageCount={pageCount}
  >
    <BorrowersRecap
      borrowers={borrowers}
      calculator={calculator}
      twoBorrowers={borrowers.length > 1}
      anonymous={options && options.anonymous}
    />
  </PdfPage>
);

export default LoanBankBorrowers;
