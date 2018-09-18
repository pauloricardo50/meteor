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
    <h5>
      {name} - Conseiller : {assignedEmployee}
    </h5>
  </div>
);

export default LoanBankLoanInfo;
