// @flow
import React from 'react';

type LoanBoardColumnHeaderProps = {};

const LoanBoardColumnHeader = ({ id }: LoanBoardColumnHeaderProps) => (
  <div className="loan-board-column-header">
    <h4 className="title">{id}</h4>
  </div>
);

export default LoanBoardColumnHeader;
