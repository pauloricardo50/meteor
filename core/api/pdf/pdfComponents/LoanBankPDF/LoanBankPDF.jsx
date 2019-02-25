// @flow
import React from 'react';

import withTranslationContext from 'imports/core/components/Translation/withTranslationContext';
import stylesheet from './stylesheet';
import LoanBankBorrowers from './LoanBankBorrowers';
import LoanBankProject from './LoanBankProject';
import LoanBankCover from './LoanBankCover';
import Pdf from '../Pdf/Pdf';
import PropertyPdfPage from '../pages/PropertyPdfPage';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
  pdfName: String,
};

const pages = ({ loan, options }) => [
  { Component: LoanBankCover, data: { loan, options } },
  { Component: PropertyPdfPage, data: { loan, options } },
  { Component: LoanBankProject, data: { loan, options } },
  { Component: LoanBankBorrowers, data: { loan, options } },
];

const LoanBankPDF = ({ loan, options, pdfName }: LoanBankPDFProps) => (
  <Pdf
    stylesheet={stylesheet}
    pages={pages({ loan, options })}
    pdfName={pdfName}
  />
);

export default withTranslationContext(() => ({ purchaseType: 'ACQUISITION' }))(LoanBankPDF);
