// @flow
import React from 'react';

import Board from '../../../components/Board';
import LoanBoardOptions from './LoanBoardOptions';
import LoanBoardContainer from './LoanBoardContainer';
import LoanBoardColumnHeader from './LoanBoardColumnHeader';
import LoanBoardCard from './LoanBoardCard';
import LoanModal from './LoanModal';

type LoanBoardProps = {};

const LoanBoard = ({
  options,
  dispatch,
  data,
  admins,
  promotions,
  lenders,
  refetchLoans,
  setLoanId,
  loanId,
  currentUser,
  ...props
}: LoanBoardProps) => (
  <div className="loan-board">
    <LoanBoardOptions
      options={options}
      dispatch={dispatch}
      admins={admins}
      promotions={promotions}
      lenders={lenders}
      refetchLoans={refetchLoans}
    />
    <Board
      data={data}
      columnHeader={LoanBoardColumnHeader}
      columnHeaderProps={{ options, dispatch, admins, promotions }}
      columnItem={LoanBoardCard}
      columnItemProps={{ setLoanId }}
    />
    <LoanModal
      loanId={loanId}
      closeModal={() => setLoanId('')}
      currentUser={currentUser}
    />
  </div>
);

export default LoanBoardContainer(LoanBoard);
