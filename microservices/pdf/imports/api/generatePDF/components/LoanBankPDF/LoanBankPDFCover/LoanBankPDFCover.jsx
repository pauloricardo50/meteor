// @flow
import React from 'react';
import { T } from 'core/components/Translation/Translation';

type LoanBankPDFCoverProps = {
  loan: Object,
};

const footer = assignedEmployee => (
  <div className="cover-footer">
    <div className="assigned-employee">{assignedEmployee.name}</div>
  </div>
);

const LoanBankPDFCover = ({ loan }: LoanBankPDFCoverProps) => (
  <div>Hello World</div>
);

export default LoanBankPDFCover;
