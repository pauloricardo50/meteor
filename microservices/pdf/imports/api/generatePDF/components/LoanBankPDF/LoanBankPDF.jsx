// @flow
import React from 'react';
import InlineCss from 'react-inline-css';
import stylesheet from './stylesheet';
import LoanBankHeader from './LoanBankHeader';
import LoanBankLoanInfo from './LoanBankLoanInfo';

type LoanBankPDFProps = {
  loan: Object,
  options?: Object,
};

const LoanBankPDF = ({ loan, options }: LoanBankPDFProps) => (
  <InlineCss stylesheet={stylesheet}>
    <div className="loan-bank-pdf">
      <LoanBankHeader />
      <LoanBankLoanInfo
        name={loan.name}
        assignedEmployee={loan.user.assignedEmployee.name}
      />
      <p>{loan.name}</p>
    </div>
  </InlineCss>
);

export default LoanBankPDF;
