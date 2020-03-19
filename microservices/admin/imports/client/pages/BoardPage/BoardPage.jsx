import React, { useState } from 'react';
import { withProps, compose } from 'recompose';
import withMatchParam from 'core/containers/withMatchParam';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import LoanBoard from './LoanBoard';

const BoardPage = ({
  currentUser,
  loanBoardOptions,
  loanBoardDispatch,
  activateLoanBoardSync,
  setActivateLoanBoardSync,
  board,
  setBoard,
}) => (
  <>
    <RadioTabs
      options={[
        { id: 'loans', label: 'Hypothèques' },
        { id: 'insuranceRequests', label: 'Assurances' },
      ]}
      onChange={setBoard}
      value={board}
    />
    {board === 'loans' ? (
      <LoanBoard
        currentUser={currentUser}
        options={loanBoardOptions}
        dispatch={loanBoardDispatch}
        activateLoanBoardSync={activateLoanBoardSync}
        setActivateLoanBoardSync={setActivateLoanBoardSync}
      />
    ) : (
      <div>Hello</div>
    )}
  </>
);

export default compose(
  withMatchParam('boardId'),
  withProps(({ boardId }) => {
    const [board, setBoard] = useState(boardId || 'loans');

    return {
      board,
      setBoard,
    };
  }),
)(BoardPage);
