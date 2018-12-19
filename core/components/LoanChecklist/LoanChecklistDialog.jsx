// @flow
import React from 'react';

import T from '../Translation';
import DialogSimple from '../DialogSimple';
import LoanChecklist from '.';

type LoanChecklistDialogProps = {};

const LoanChecklistDialog = ({ loan }: LoanChecklistDialogProps) => (
  <DialogSimple
    closeOnly
    label={<T id="LoanChecklist.dialogButton" />}
    buttonProps={{ className: 'loan-checklist-dialog' }}
  >
    <LoanChecklist loan={loan} />
  </DialogSimple>
);

export default LoanChecklistDialog;
