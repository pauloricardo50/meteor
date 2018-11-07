// @flow
import React from 'react';
import { IntlProvider } from 'react-intl';

import { getUserLocale, getFormats } from 'core/utils/localization';
import { T } from 'core/components/Translation/Translation';
import messagesFR from '../../../../../lang/fr.json';
import stylesheet from './stylesheet';
import LoanBankBorrowers from './LoanBankBorrowers';
import LoanBankProject from './LoanBankProject';
import LoanBankPage from './LoanBankPage';
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
  },
  {
    content: <LoanBankBorrowers borrowers={loan.borrowers} key="3" />,
    title: <T id="PDF.title.borrowers" />,
  },
];

const LoanBankPDF = ({ loan, options }: LoanBankPDFProps) => (
  <IntlProvider
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    defaultLocale="fr"
  >
    <>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      {pages(loan).map(({ title, subtitle, content }, index, arr) => (
        <LoanBankPage
          pageNumber={index + 1}
          title={title}
          subtitle={subtitle}
          key={index}
          isLast={index === arr.length - 1}
        >
          {content}
        </LoanBankPage>
      ))}
    </>
  </IntlProvider>
);

export default LoanBankPDF;
