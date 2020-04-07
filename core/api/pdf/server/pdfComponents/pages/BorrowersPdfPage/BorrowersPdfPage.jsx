import React from 'react';

import T from '../../../../../../components/Translation';
import PdfPage from '../../PdfPage';
import BorrowersRecap from './BorrowersRecap';

const BorrowersPdfPage = ({
  loan: { borrowers },
  calculator,
  pageNb,
  pageCount,
  options,
}) => (
  <PdfPage
    className="borrowers-page"
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

export default BorrowersPdfPage;
