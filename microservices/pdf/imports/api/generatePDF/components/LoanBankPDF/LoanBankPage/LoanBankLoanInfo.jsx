// @flow
import React from 'react';
import { T } from 'core/components/Translation/Translation';

type LoanBankLoanInfoProps = {
  name: String,
  purchaseType: String,
  residenceType: String,
  assignedEmployee: String,
};

const LoanBankLoanInfo = ({
  name,
  purchaseType,
  residenceType,
  assignedEmployee,
}: LoanBankLoanInfoProps) => (
  <div className="loan-bank-pdf-info">
    <h3>
      {name} - <T id={`PDF.purchaseType.${purchaseType}`} />{' '}
      <T id={`PDF.residenceType.${residenceType}`} />
    </h3>
    <h3>
      <T id="PDF.assignedEmployee" /> : {assignedEmployee}
    </h3>
  </div>
);

export default LoanBankLoanInfo;
