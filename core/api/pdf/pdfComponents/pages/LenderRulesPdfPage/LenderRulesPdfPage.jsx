// @flow
import React from 'react';

import T from '../../../../../components/Translation';
import PdfPage from '../../PdfPage';

type LenderRulesPdfPageProps = {};

const LenderRulesPdfPage = ({
  pageNb,
  pageCount,
  organisation,
  loan,
}: LenderRulesPdfPageProps) => (
  <PdfPage
    className="lender-rules-page"
    title={<T id="PDF.title.lenderRules" />}
    withFooter
    pageNb={pageNb}
    pageCount={pageCount}
  >
    A faire
  </PdfPage>
);

export default LenderRulesPdfPage;
