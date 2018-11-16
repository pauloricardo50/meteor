// @flow
import React from 'react';

import stylesheet from './stylesheet';
import LoanBankBorrowers from './LoanBankBorrowers';
import LoanBankProject from './LoanBankProject';
import LoanBankCover from './LoanBankCover';
import Pdf from '../Pdf/Pdf';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
};

const pages = loan => [
  { Component: LoanBankCover, data: { loan } },
  { Component: LoanBankProject, data: { loan } },
  { Component: LoanBankBorrowers, data: { loan } },
];

const LoanBankPDF = ({ loan, options }: LoanBankPDFProps) => (
  <Pdf stylesheet={stylesheet} pages={pages(loan)} />
);

export default LoanBankPDF;
