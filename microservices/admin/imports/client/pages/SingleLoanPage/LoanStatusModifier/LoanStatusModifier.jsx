import React, { useContext } from 'react';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { loanSetStatus } from 'core/api/methods/index';
import { ModalManagerContext } from 'core/components/ModalManager';
import StatusLabel from 'core/components/StatusLabel';

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
