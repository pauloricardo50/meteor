// @flow
import React from 'react';

import Board from '../../../components/Board';
import LoanBoardOptions from './LoanBoardOptions';
import LoanBoardContainer from './LoanBoardContainer';
import LoanBoardColumnHeader from './LoanBoardColumnHeader';
import LoanBoardCard from './LoanBoardCard';
import LoanModal from './LoanModal';
import { ACTIONS } from './loanBoardConstants';

type LoanBoardProps = {};

const LoanBoard = ({
  options,
  dispatch,
  data,
  admins,
  promotions,
  lenders,
  refetchLoans,
  currentUser,
  activateSync,
  setActivateSync,
}: LoanBoardProps) => (
  <div className="loan-board">
    <LoanBoardOptions
      options={options}
      dispatch={dispatch}
      admins={admins}
      promotions={promotions}
      lenders={lenders}
      refetchLoans={refetchLoans}
      activateSync={activateSync}
      setActivateSync={setActivateSync}
    />
    <Board
      data={data}
      columnHeader={LoanBoardColumnHeader}
      columnHeaderProps={{ options, dispatch, admins, promotions }}
      columnItem={LoanBoardCard}
      columnItemProps={{
        setLoanId: loanId =>
          dispatch({ type: ACTIONS.SET_LOAN_ID, payload: loanId }),
      }}
    />
    <LoanModal
      loanId={options.loanId}
      closeModal={() => dispatch({ type: ACTIONS.SET_LOAN_ID, payload: '' })}
      currentUser={currentUser}
    />
  </div>
);

export default LoanBoardContainer(LoanBoard);
