// @flow
import React from 'react';
import InlineCss from 'react-inline-css';
import { IntlProvider } from 'react-intl';
import { getUserLocale, getFormats } from 'core/utils/localization';
import stylesheet from './stylesheet';
import LoanBankHeader from './LoanBankHeader';
import LoanBankLoanInfo from './LoanBankLoanInfo';
import LoanBankBorrowers from './LoanBankBorrowers';
import messagesFR from '../../../../../lang/fr.json';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
};

const LoanBankPDF = ({ loan, options }: LoanBankPDFProps) => (
  <IntlProvider
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    defaultLocale="fr"
  >
    <InlineCss stylesheet={stylesheet}>
      <div className="loan-bank-pdf">
        <LoanBankHeader />
        <LoanBankLoanInfo
          name={loan.name}
          assignedEmployee={loan.user.assignedEmployee.name}
        />
        <div className="loan-bank-pdf-recaps">
          <LoanBankBorrowers borrowers={loan.borrowers} />
        </div>
      </div>
    </InlineCss>
  </IntlProvider>
);

export default LoanBankPDF;
