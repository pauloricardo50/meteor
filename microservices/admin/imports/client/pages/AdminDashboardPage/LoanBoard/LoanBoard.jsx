// @flow
import React from 'react';

import Board from '../../../components/Board';
import LoanBoardOptions from './LoanBoardOptions';
import LoanBoardContainer from './LoanBoardContainer';
import LoanBoardColumnHeader from './LoanBoardColumnHeader';
import LoanBoardCard from './LoanBoardCard';

type LoanBoardProps = {};

const LoanBoard = ({ options, dispatch, data }: LoanBoardProps) => {
  console.log('data:', data);
  return (
    <div className="loan-board">
      <LoanBoardOptions options={options} dispatch={dispatch} />
      <Board
        data={data}
        columnHeader={LoanBoardColumnHeader}
        columnItem={LoanBoardCard}
      />
    </div>
  );
};

export default LoanBoardContainer(LoanBoard);
