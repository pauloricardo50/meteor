import React from 'react';

import LoanBoard from './LoanBoard';

const LoanBoardPage = ({
  currentUser,
  loanBoardOptions,
  loanBoardDispatch,
  activateLoanBoardSync,
  setActivateLoanBoardSync,
}) => (
  <LoanBoard
    currentUser={currentUser}
    options={loanBoardOptions}
    dispatch={loanBoardDispatch}
    activateLoanBoardSync={activateLoanBoardSync}
    setActivateLoanBoardSync={setActivateLoanBoardSync}
  />
);

export default LoanBoardPage;
