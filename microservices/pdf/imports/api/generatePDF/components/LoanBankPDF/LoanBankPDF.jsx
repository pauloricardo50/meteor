// @flow
import React from 'react';
import { IntlProvider } from 'react-intl';

import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../../../lang/fr.json';
import stylesheet from './stylesheet';
import LoanBankBorrowers from './LoanBankBorrowers';
import LoanBankProject from './LoanBankProject';
import LoanBankCover from './LoanBankCover';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
};

const pages = [
  { Component: LoanBankCover },
  { Component: LoanBankProject },
  { Component: LoanBankBorrowers },
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
      {pages.map(({ Component }, index) => (
        <Component loan={loan} key={index} />
      ))}
    </>
  </IntlProvider>
);

export default LoanBankPDF;
