// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { LOAN_VERIFICATION_STATUS } from 'core/api/constants';
import { requestLoanVerification } from 'core/api';

type VerificationRequesterProps = {};

const VerificationRequester = ({
  loan: { verificationStatus = LOAN_VERIFICATION_STATUS.NONE },
}: VerificationRequesterProps) => {
  if (verificationStatus === LOAN_VERIFICATION_STATUS.OK) {
    return null;
  }

  return (
    <Button
      raised
      className="verification-requester"
      disabled={verificationStatus === LOAN_VERIFICATION_STATUS.REQUESTED}
      onClick={() => requestLoanVerification.run({ loanId: loan_id })}
    >
      <T id={`VerificationRequester.${verificationStatus}`} />
    </Button>
  );
};

export default VerificationRequester;
