// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { LOAN_VERIFICATION_STATUS } from 'core/api/constants';
import { requestLoanVerification } from 'core/api';

type VerificationRequesterProps = {};

const VerificationRequester = ({
  loan,
  todos,
  isDone,
}: VerificationRequesterProps) => {
  const {
    verificationStatus = LOAN_VERIFICATION_STATUS.NONE,
    _id: loanId,
  } = loan;

  if (verificationStatus === LOAN_VERIFICATION_STATUS.OK) {
    return null;
  }

  if (isDone) {
    return null;
  }

  const previousTodos = todos.filter(({ id }) => id !== 'verification');

  if (previousTodos.some(({ isDone }) => !isDone(loan))) {
    return null;
  }

  return (
    <Button
      raised
      className="verification-requester"
      disabled={verificationStatus === LOAN_VERIFICATION_STATUS.REQUESTED}
      onClick={() => requestLoanVerification.run({ loanId })}
    >
      <T id={`VerificationRequester.${verificationStatus}`} />
    </Button>
  );
};

export default VerificationRequester;
