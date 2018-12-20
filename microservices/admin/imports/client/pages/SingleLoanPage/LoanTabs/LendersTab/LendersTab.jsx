// @flow
import React from 'react';
import { InsertLenderDialogForm } from './LenderDialogForm';

type LendersTabProps = {
  loan: Object,
};

const LendersTab = ({ loan: { _id: loanId } }: LendersTabProps) => {
  console.log('loanId', loanId);
  return (
    <div>
      <InsertLenderDialogForm loanId={loanId} />
    </div>
  );
};

export default LendersTab;
