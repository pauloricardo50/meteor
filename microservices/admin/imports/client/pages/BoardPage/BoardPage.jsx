import React from 'react';

import LoanBoard from './LoanBoard';

const BoardPage = ({
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

export default BoardPage;
