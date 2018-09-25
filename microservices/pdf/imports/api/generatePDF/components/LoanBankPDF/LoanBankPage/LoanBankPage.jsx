// @flow
import React from 'react';
import LoanBankHeader from './LoanBankHeader';
import LoanBankFooter from './LoanBankFooter';
import LoanBankTitle from './LoanBankTitle';

type LoanBankPageProps = {
  loan: Object,
  pageNumber: Number,
  title: String,
};

const LoanBankPage = ({
  loan,
  pageNumber,
  title,
  children,
}: LoanBankPageProps) => (
  <div className="loan-bank-pdf-page">
    <LoanBankHeader />
    <LoanBankTitle
      title={title}
      purchaseType={loan.general.purchaseType}
      residenceType={loan.general.residenceType}
    />
    <div className="loan-bank-pdf-page-content">{children}</div>
    <LoanBankFooter pageNumber={pageNumber} loan={loan} />
  </div>
);

export default LoanBankPage;
