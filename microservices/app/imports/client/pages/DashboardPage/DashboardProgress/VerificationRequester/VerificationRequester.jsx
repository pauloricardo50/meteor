// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { LOAN_VERIFICATION_STATUS } from 'core/api/constants';
import { requestLoanVerification } from 'core/api/methods';
import Calculator from 'core/utils/Calculator';

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

  // Filter out todos that are checking percentage progress
  const previousTodos = todos
    .filter(({ id }) => !['completeBorrowers', 'uploadDocuments'].includes(id))
    .filter(({ id }) => id !== 'verification');

  const borrowersProgress = Calculator.personalInfoPercent({ loan });
  const filesProgress = Calculator.filesProgress({ loan }).percent;
  const progressIsAcceptable = borrowersProgress >= 0.8 && filesProgress >= 0.5;

  if (previousTodos.some(({ isDone }) => !isDone) || !progressIsAcceptable) {
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
