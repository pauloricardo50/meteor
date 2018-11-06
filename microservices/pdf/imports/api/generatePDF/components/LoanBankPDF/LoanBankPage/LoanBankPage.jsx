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
  pageNumber,
  title,
  subtitle,
  children,
  isLast,
}: LoanBankPageProps) => (
  <>
    <LoanBankHeader />
    <LoanBankTitle title={title} subtitle={subtitle} />
    <div className="page content">{children}</div>
    {!isLast && <hr className="page-break-new" />}
  </>
);

export default LoanBankPage;
