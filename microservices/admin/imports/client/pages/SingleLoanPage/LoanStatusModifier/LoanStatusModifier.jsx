// @flow
import React from 'react';

import StatusLabel from 'core/components/StatusLabel';
import { LOANS_COLLECTION } from 'core/api/constants';
import Dialog from 'core/components/Material/Dialog';
import LoanStatusModifierContainer from './LoanStatusModifierContainer';

type LoanStatusModifierProps = {
  loan: Object,
  additionalActions: Function,
  openDialog: Boolean,
  setOpenDialog: Boolean,
  dialogContent: React.Component,
};

const LoanStatusModifier = ({
  loan,
  additionalActions,
  openDialog,
  setOpenDialog,
  dialogContent,
  title,
}: LoanStatusModifierProps) => (
  <>
    <StatusLabel
      collection={LOANS_COLLECTION}
      status={loan.status}
      allowModify
      docId={loan._id}
      additionalActions={additionalActions}
    />
    <Dialog open={openDialog} title={title}>
      {dialogContent}
    </Dialog>
  </>
);

export default LoanStatusModifierContainer(LoanStatusModifier);
