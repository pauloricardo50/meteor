// @flow
import React from 'react';

import LoanBoard from './LoanBoard';

type LoanBoardPageProps = {};

const LoanBoardPage = ({
  currentUser,
  loanBoardOptions,
  loanBoardDispatch,
  activateLoanBoardSync,
  setActivateLoanBoardSync,
}: LoanBoardPageProps) => (
  <LoanBoard
    currentUser={currentUser}
    options={loanBoardOptions}
    dispatch={loanBoardDispatch}
    activateLoanBoardSync={activateLoanBoardSync}
    setActivateLoanBoardSync={setActivateLoanBoardSync}
  />
);

export default LoanBoardPage;
