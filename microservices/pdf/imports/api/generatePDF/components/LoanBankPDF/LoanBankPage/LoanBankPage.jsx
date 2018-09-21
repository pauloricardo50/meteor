// @flow
import React from 'react';
import LoanBankHeader from './LoanBankHeader';
import LoanBankFooter from './LoanBankFooter';
import LoanBankLoanInfo from './LoanBankLoanInfo';

type LoanBankPageProps = {
  loan: Object,
  pageNumber: Number,
};

const LoanBankPage = ({ loan, pageNumber, children }: LoanBankPageProps) => (
  <div className="loan-bank-pdf-page">
    <LoanBankHeader />
    <LoanBankLoanInfo
      name={loan.name}
      assignedEmployee={loan.user.assignedEmployee.name}
    />
    <div className="loan-bank-pdf-page-content">{children}</div>
    <LoanBankFooter pageNumber={pageNumber} />
  </div>
);

export default LoanBankPage;
