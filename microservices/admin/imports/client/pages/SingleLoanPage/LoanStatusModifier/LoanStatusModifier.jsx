import React, { useContext } from 'react';

import { loanSetStatus } from 'core/api/loans/methodDefinitions';
import { ModalManagerContext } from 'core/components/ModalManager';
import StatusLabel from 'core/components/StatusLabel';

import LoanStatusModifierContainer from './LoanStatusModifierContainer';

const LoanStatusModifier = ({ loan, additionalActions, ...props }) => {
  const { openModal } = useContext(ModalManagerContext);

  return (
    <StatusLabel
      collection={loan._collection}
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
