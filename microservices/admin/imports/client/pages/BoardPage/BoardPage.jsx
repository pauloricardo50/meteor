import React, { useState } from 'react';
import { compose, withProps } from 'recompose';

import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import withMatchParam from 'core/containers/withMatchParam';

import InsuranceRequestBoard from './InsuranceRequestBoard/InsuranceRequestBoard';
import LoanBoard from './LoanBoard/LoanBoard';

const BoardPage = ({
  loanBoardOptions,
  loanBoardDispatch,
  insuranceRequestBoardOptions,
  insuranceRequestBoardDispatch,
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
      <LoanBoard options={loanBoardOptions} dispatch={loanBoardDispatch} />
    ) : (
      <InsuranceRequestBoard
        options={insuranceRequestBoardOptions}
        dispatch={insuranceRequestBoardDispatch}
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
