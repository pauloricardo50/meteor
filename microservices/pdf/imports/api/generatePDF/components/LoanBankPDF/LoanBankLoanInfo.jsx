// @flow
import React from 'react';

type LoanBankLoanInfoProps = {
  name: String,
  assignedEmployee: String,
};

const LoanBankLoanInfo = ({
  name,
  assignedEmployee,
}: LoanBankLoanInfoProps) => (
  <div className="loan-bank-pdf-info">
    <h3>
      {name} - Conseiller : {assignedEmployee}
    </h3>
  </div>
);

export default LoanBankLoanInfo;
