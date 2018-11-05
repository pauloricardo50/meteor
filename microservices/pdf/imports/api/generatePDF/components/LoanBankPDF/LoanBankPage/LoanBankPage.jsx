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
}: LoanBankPageProps) => (
  // <div style={{ pageBreakBefore: 'always', width: '100%' }}>
  <>
    <hr className="page-break-new" />
    {/* <div className="page"> */}
    <LoanBankHeader />
    <LoanBankTitle title={title} subtitle={subtitle} />
    <div className="content">{children}</div>
    <LoanBankFooter pageNumber={pageNumber} />
    {/* </div> */}
  </>
);

export default LoanBankPage;
