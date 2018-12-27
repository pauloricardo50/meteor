// @flow
import React from 'react';

import { InsertLenderDialogForm } from './LenderDialogForm';
import LendersActivation from './LendersActivation';
import LenderList from './LenderList';
import LenderPicker from './LenderPicker';

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
      {/* <InsertLenderDialogForm loanId={loanId} /> */}
      <LenderPicker {...props} />
      <LenderList {...props} />
    </div>
  );
};

export default LendersTab;
