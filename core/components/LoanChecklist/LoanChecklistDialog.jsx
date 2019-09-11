// @flow
import React from 'react';

import T from '../Translation';
import DialogSimple from '../DialogSimple';
import LoanChecklist from '.';
import { getChecklistValidInformationsRatio } from './helpers';
import Icon from '../Icon/Icon';

type LoanChecklistDialogProps = {};

const LoanChecklistDialog = ({ loan }: LoanChecklistDialogProps) => {
  const { valid, required } = getChecklistValidInformationsRatio({ loan });
  let ratio = `(${valid}/${required})`;
  if (valid === required) {
    ratio = <Icon type="check" className="icon success" />;
  }

  return (
    <DialogSimple
      closeOnly
      label={(
        <div className="flex-row center">
          <T id="LoanChecklist.dialogButton" />
          &nbsp;
          {ratio}
        </div>
      )}
      buttonProps={{ className: 'loan-checklist-dialog' }}
    >
      <LoanChecklist loan={loan} />
    </DialogSimple>
  );
};

export default LoanChecklistDialog;
