import React, { useState } from 'react';
import { withProps, compose } from 'recompose';
import withMatchParam from 'core/containers/withMatchParam';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import LoanBoard from './LoanBoard/LoanBoard';
import InsuranceRequestBoard from './InsuranceRequestBoard/InsuranceRequestBoard';

const BoardPage = ({
  currentUser,
  loanBoardOptions,
  loanBoardDispatch,
  insuranceRequestBoardOptions,
  insuranceRequestBoardDispatch,
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
      <InsuranceRequestBoard
        currentUser={currentUser}
        options={insuranceRequestBoardOptions}
        dispatch={insuranceRequestBoardDispatch}
        activateLoanBoardSync={activateLoanBoardSync}
        setActivateLoanBoardSync={setActivateLoanBoardSync}
      />
    )}
  </>
);

export default compose(
  withMatchParam('boardId'),
  withProps(({ boardId, currentUser }) => {
    console.log('currentUser:', currentUser);
    const [board, setBoard] = useState(
      boardId || currentUser?.defaultBoardId || 'loans',
    );

    return {
      board,
      setBoard,
    };
  }),
)(BoardPage);
