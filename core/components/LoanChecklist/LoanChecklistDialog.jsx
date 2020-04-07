import React from 'react';

import DialogSimple from '../DialogSimple';
import Icon from '../Icon/Icon';
import T from '../Translation';
import { getChecklistValidInformationsRatio } from './helpers';
import LoanChecklist from '.';

const LoanChecklistDialog = ({ loan }) => {
  const { valid, required } = getChecklistValidInformationsRatio({ loan });
  let ratio = `(${valid}/${required})`;
  if (valid === required && required !== 0) {
    ratio = <Icon type="check" className="icon success" />;
  }

  return (
    <DialogSimple
      closeOnly
      label={
        <div className="flex-row center">
          <T id="LoanChecklist.dialogButton" />
          &nbsp;
          {ratio}
        </div>
      }
      buttonProps={{ className: 'loan-checklist-dialog' }}
    >
      <LoanChecklist loan={loan} />
    </DialogSimple>
  );
};

export default LoanChecklistDialog;
