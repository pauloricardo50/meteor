// @flow
import React from 'react';

import { LOAN_VERIFICATION_STATUS, LOANS_COLLECTION } from 'core/api/constants';
import UpdateField from 'core/components/UpdateField';
import { loanUpdate } from 'core/api';

type VerificationSetterProps = {};

const VerificationSetter = ({ loan }: VerificationSetterProps) => (
  <UpdateField
    collection={LOANS_COLLECTION}
    doc={loan}
    fields={['verificationStatus']}
    onSuccess={({ verificationStatus }) => {
      if (verificationStatus === LOAN_VERIFICATION_STATUS.OK) {
        return loanUpdate.run({
          loanId: loan._id,
          object: { userFormsEnabled: false },
        });
      }
      if (verificationStatus === LOAN_VERIFICATION_STATUS.ERROR) {
        return loanUpdate.run({
          loanId: loan._id,
          object: { userFormsEnabled: true },
        });
      }
    }}
  />
);

export default VerificationSetter;
