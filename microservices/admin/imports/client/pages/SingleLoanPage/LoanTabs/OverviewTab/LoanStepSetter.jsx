// @flow
import React from 'react';

import UpdateField from 'core/components/UpdateField';
import { LOANS_COLLECTION, STEPS } from 'core/api/constants';
import { setLoanStep } from 'core/api/methods';

type LoanStepSetterProps = {};

const LoanStepSetter = ({ loan }: LoanStepSetterProps) => {
  const { _id: loanId, step } = loan;

  return (
    <UpdateField
      doc={loan}
      fields={['step']}
      collection={LOANS_COLLECTION}
      onSubmit={({ step: nextStep }) => {
        let confirm = true;

        if (step === STEPS.SOLVENCY && nextStep === STEPS.REQUEST) {
          confirm = window.confirm('Passer à l\'étape "Identification du prêteur" activera les offres et enverra un mail au client pour l\'inviter à  les consulter.');
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
