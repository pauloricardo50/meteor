import React, { useState } from 'react';
import { compose, withProps } from 'recompose';

import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import withMatchParam from 'core/containers/withMatchParam';

import InsuranceRequestBoard from './InsuranceRequestBoard/InsuranceRequestBoard';
import LoanBoard from './LoanBoard/LoanBoard';

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
    const [board, setBoard] = useState(
      boardId || currentUser?.defaultBoardId || 'loans',
    );

    return {
      board,
      setBoard,
    };
  }),
)(BoardPage);
