// @flow
import React from 'react';

import StatusLabel from 'core/components/StatusLabel';
import { LOANS_COLLECTION } from 'core/api/constants';
import Dialog from 'core/components/Material/Dialog';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import LoanStatusModifierContainer from './LoanStatusModifierContainer';

type LoanStatusModifierProps = {
  loan: Object,
  additionalActions: Function,
  openDialog: Boolean,
  setOpenDialog: Boolean,
  dialogContent: React.Component,
  title: String,
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
    <Dialog
      open={openDialog}
      title={title}
      actions={[
        <Button
          primary
          label={<T id="general.close" />}
          onClick={() => setOpenDialog(false)}
          key="close"
        />,
      ]}
      important
    >
      {dialogContent}
    </Dialog>
  </>
);

export default LoanStatusModifierContainer(LoanStatusModifier);
