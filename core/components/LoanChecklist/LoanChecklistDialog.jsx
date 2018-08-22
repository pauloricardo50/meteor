// @flow
import React from 'react';

import DialogSimple from '../DialogSimple';
import LoanChecklist from '.';

type LoanChecklistDialogProps = {};

const LoanChecklistDialog = ({ loan }: LoanChecklistDialogProps) => (
  <DialogSimple cancelOnly label="Voir la checklist">
    <LoanChecklist loan={loan} />
  </DialogSimple>
);

export default LoanChecklistDialog;
