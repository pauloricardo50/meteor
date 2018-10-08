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
import LoanBankCover from './LoanBankCover';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
};

const pages = loan => [
  {
    content: <LoanBankCover loan={loan} key="1" />,
  },
  {
    content: <LoanBankProject loan={loan} key="2" />,
    title: <T id="PDF.title.project" />,
    subtitle: <T id="PDF.subtitle.project" />,
  },
  {
    content: <LoanBankBorrowers borrowers={loan.borrowers} key="3" />,
    title: <T id="PDF.title.borrowers" />,
  },
  {
    content: <LoanBankFinancing key="4" />,
    title: <T id="PDF.title.financing" />,
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
        {pages(loan).map(({ title, subtitle, content }, index) => (
          <LoanBankPage
            pageNumber={index + 1}
            title={title}
            subtitle={subtitle}
            key={index}
          >
            {content}
          </LoanBankPage>
        ))}
      </div>
    </InlineCss>
  </IntlProvider>
);

export default LoanBankPDF;
