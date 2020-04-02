import React from 'react';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { setLoanStep } from 'core/api/methods';
import UpdateField from 'core/components/UpdateField';
import { shouldSendStepNotification } from 'core/utils/loanFunctions';

const LoanStepSetter = ({ loan }) => {
  const { _id: loanId, step } = loan;

  return (
    <UpdateField
      doc={loan}
      fields={['step']}
      collection={LOANS_COLLECTION}
      onSubmit={({ step: nextStep }) => {
        let confirm = true;

        if (shouldSendStepNotification(step, nextStep)) {
          confirm = window.confirm(
            'Passer à l\'étape "Identification du prêteur" activera les offres et enverra un mail au client pour l\'inviter à  les consulter.',
          );
        }

        if (confirm) {
          return setLoanStep.run({ loanId, nextStep });
        }

        // Do this to reset the form state..
        location.reload();
        return Promise.resolve();
      }}
    />
  );
};

export default LoanStepSetter;
