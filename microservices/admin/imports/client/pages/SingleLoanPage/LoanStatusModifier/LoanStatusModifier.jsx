//
import React, { useContext } from 'react';

import StatusLabel from 'core/components/StatusLabel';
import { LOANS_COLLECTION } from 'core/api/constants';
import { ModalManagerContext } from 'core/components/ModalManager';
import { loanSetStatus } from 'imports/core/api/methods/index';
import LoanStatusModifierContainer from './LoanStatusModifierContainer';

const LoanStatusModifier = ({ loan, additionalActions, ...props }) => {
  const { openModal } = useContext(ModalManagerContext);

  return (
    <StatusLabel
      collection={LOANS_COLLECTION}
      status={loan.status}
      allowModify
      docId={loan._id}
      additionalActions={additionalActions(openModal)}
      method={status => loanSetStatus.run({ loanId: loan._id, status })}
      {...props}
    />
  );
};

export default LoanStatusModifierContainer(LoanStatusModifier);
