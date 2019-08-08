// @flow
import React, { useContext } from 'react';

import StatusLabel from 'core/components/StatusLabel';
import { LOANS_COLLECTION } from 'core/api/constants';
import { ModalManagerContext } from 'core/components/ModalManager';
import LoanStatusModifierContainer from './LoanStatusModifierContainer';

type LoanStatusModifierProps = {
  loan: Object,
  additionalActions: Function,
};

const LoanStatusModifier = ({
  loan,
  additionalActions,
}: LoanStatusModifierProps) => {
  const { openModal } = useContext(ModalManagerContext);

  return (
    <StatusLabel
      collection={LOANS_COLLECTION}
      status={loan.status}
      allowModify
      docId={loan._id}
      additionalActions={additionalActions(openModal)}
    />
  );
};

export default LoanStatusModifierContainer(LoanStatusModifier);
