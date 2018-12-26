// @flow
import React from 'react';

import { InsertLenderDialogForm } from './LenderDialogForm';
import LendersActivation from './LendersActivation';

type LendersTabProps = {
  loan: Object,
};

const LendersTab = (props: LendersTabProps) => {
  const {
    loan: { _id: loanId },
  } = props;
  return (
    <div>
      <LendersActivation loan={props.loan} />
      <InsertLenderDialogForm loanId={loanId} />
    </div>
  );
};

export default LendersTab;
