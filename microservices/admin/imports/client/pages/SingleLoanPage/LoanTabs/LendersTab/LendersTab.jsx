// @flow
import React from 'react';

import { InsertLenderDialogForm } from './LenderDialogForm';
import LendersActivation from './LendersActivation';
import LenderList from './LenderList';

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
      <LenderList {...props} />
    </div>
  );
};

export default LendersTab;
