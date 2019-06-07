// @flow
import React from 'react';

import Board from '../../../components/Board';
import LoanBoardOptions from './LoanBoardOptions';
import LoanBoardContainer from './LoanBoardContainer';
import LoanBoardColumnHeader from './LoanBoardColumnHeader';
import LoanBoardCard from './LoanBoardCard';

type LoanBoardProps = {};

const LoanBoard = ({
  options,
  dispatch,
  data,
  admins,
  promotions,
  refetchLoans,
  ...props
}: LoanBoardProps) => (
  <div className="loan-board">
    <LoanBoardOptions
      options={options}
      dispatch={dispatch}
      admins={admins}
      promotions={promotions}
      refetchLoans={refetchLoans}
    />
    <Board
      data={data}
      columnHeader={LoanBoardColumnHeader}
      columnHeaderProps={{ options, dispatch, admins, promotions }}
      columnItem={LoanBoardCard}
    />
  </div>
);

export default LoanBoardContainer(LoanBoard);
