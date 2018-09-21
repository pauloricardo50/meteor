// @flow
import React from 'react';
import InlineCss from 'react-inline-css';
import { IntlProvider } from 'react-intl';
import { getUserLocale, getFormats } from 'core/utils/localization';
import stylesheet from './stylesheet';
import LoanBankBorrowers from './LoanBankBorrowers';
import messagesFR from '../../../../../lang/fr.json';
import LoanBankProject from './LoanBankProject';
import LoanBankPage from './LoanBankPage';
import LoanBankFinancing from './LoanBankFinancing';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
};

const pages = loan => [
  <LoanBankBorrowers borrowers={loan.borrowers} key="1" />,
  <LoanBankProject property={loan.properties[0]} key="2" />,
  <LoanBankFinancing structures={loan.structures} key="3" />,
];

const LoanBankPDF = ({ loan, options }: LoanBankPDFProps) => (
  <IntlProvider
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    defaultLocale="fr"
  >
    <InlineCss stylesheet={stylesheet}>
      <div className="loan-bank-pdf">
        {pages(loan).map((page, index) => (
          <LoanBankPage loan={loan} pageNumber={index + 1} key={index}>
            {page}
          </LoanBankPage>
        ))}
      </div>
    </InlineCss>
  </IntlProvider>
);

export default LoanBankPDF;
