// @flow
import React from 'react';
import { T } from 'core/components/Translation/Translation';

type LoanBankLoanInfoProps = {
  name: String,

  assignedEmployee: String,
};

const LoanBankLoanInfo = ({
  name,
  assignedEmployee,
}: LoanBankLoanInfoProps) => (
  <div className="loan-bank-pdf-info">
    <h3>{name}</h3>
    <h3>
      <T id="PDF.assignedEmployee" /> : {assignedEmployee}
    </h3>
  </div>
);

export default LoanBankLoanInfo;
