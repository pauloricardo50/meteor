// @flow
import React from 'react';
import LoanBankHeader from './LoanBankHeader';
import LoanBankFooter from './LoanBankFooter';
import LoanBankLoanInfo from './LoanBankLoanInfo';
import LoanBankTitle from './LoanBankTitle';

type LoanBankPageProps = {
  loan: Object,
  pageNumber: Number,
};

const LoanBankPage = ({ loan, pageNumber, children }: LoanBankPageProps) => (
  <div className="loan-bank-pdf-page">
    <LoanBankHeader />
    <LoanBankTitle
      purchaseType={loan.general.purchaseType}
      residenceType={loan.general.residenceType}
    />
    <LoanBankLoanInfo
      name={loan.name}
      assignedEmployee={loan.user.assignedEmployee.name}
    />
    <div className="loan-bank-pdf-page-content">{children}</div>
    <LoanBankFooter pageNumber={pageNumber} />
  </div>
);

export default LoanBankPage;
