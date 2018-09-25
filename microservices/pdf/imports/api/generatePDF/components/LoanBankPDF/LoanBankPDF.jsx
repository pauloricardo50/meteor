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
import { T } from '../../../../core/components/Translation/Translation';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
};

const pages = loan => [
  {
    content: <LoanBankProject property={loan.properties[0]} key="1" />,
    title: <T id="PDF.title.project" />,
  },
  {
    content: <LoanBankBorrowers borrowers={loan.borrowers} key="2" />,
    title: <T id="PDF.title.borrowers" />,
  },
  {
    content: (
      <LoanBankFinancing
        structures={loan.structures}
        property={loan.properties[0]}
        key="3"
      />
    ),
    title: <T id="PDF.title.project" />,
  },
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
          <LoanBankPage
            loan={loan}
            pageNumber={index + 1}
            title={page.title}
            key={index}
          >
            {page.content}
          </LoanBankPage>
        ))}
      </div>
    </InlineCss>
  </IntlProvider>
);

export default LoanBankPDF;
