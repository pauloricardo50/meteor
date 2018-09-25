// @flow
import React from 'react';
import LoanBankLoanInfo from './LoanBankLoanInfo';

type LoanBankFooterProps = {
  loan: Object,
};

const LoanBankFooter = ({ loan }: LoanBankFooterProps) => (
  <div className="loan-bank-pdf-footer">
    <LoanBankLoanInfo
      name={loan.name}
      assignedEmployee={loan.user.assignedEmployee.name}
    />
    <h3>{`Fait le ${moment(new Date()).format('DD.MM.YYYY')}`}</h3>
  </div>
);

export default LoanBankFooter;
