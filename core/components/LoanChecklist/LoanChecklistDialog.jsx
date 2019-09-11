// @flow
import React from 'react';

import T from '../Translation';
import DialogSimple from '../DialogSimple';
import LoanChecklist from '.';
import { getChecklistValidInformationsRatio } from './helpers';

type LoanChecklistDialogProps = {};

const LoanChecklistDialog = ({ loan }: LoanChecklistDialogProps) => {
  const { valid, required } = getChecklistValidInformationsRatio({ loan });
  const ratio = ` (${valid}/${required})`;

  return (
    <DialogSimple
      closeOnly
      label={(
        <span>
          <T id="LoanChecklist.dialogButton" />
          {ratio}
        </span>
      )}
      buttonProps={{ className: 'loan-checklist-dialog' }}
    >
      <LoanChecklist loan={loan} />
    </DialogSimple>
  );
};

export default LoanChecklistDialog;
