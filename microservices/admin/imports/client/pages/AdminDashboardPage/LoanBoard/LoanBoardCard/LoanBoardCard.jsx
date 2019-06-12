// @flow
import React, { useState } from 'react';

import LoanBoardCardTop from './LoanBoardCardTop';
import LoanBoardCardTasks from './LoanBoardCardTasks';
import LoanBoardCardDescription from './LoanBoardCardDescription';

type LoanBoardCardProps = {};

const LoanBoardCard = ({
  data: loan,
  setLoanId,
  style,
  admins,
}: LoanBoardCardProps) => {
  const [renderComplex, setRenderComplex] = useState(false);

  const {
    _id: loanId,
    name,
    status,
    userCache = {},
    nextDueDate = {},
    selectedStructure,
    structures = [],
    promotions = [],
  } = loan;
  const assignee = userCache
    && userCache.assignedEmployeeCache
    && userCache.assignedEmployeeCache;
  const structure = structures.find(({ id }) => id === selectedStructure);
  const promotion = promotions[0] && promotions[0].name;

  return (
    <div
      className="loan-board-card card1 card-hover animated bounceIn"
      style={style}
      onClick={() => setLoanId(loanId)}
      onMouseEnter={() => setRenderComplex(true)}
    >
      <div className="card-header">
        <LoanBoardCardTop
          status={status}
          loanId={loanId}
          name={name}
          assignee={assignee}
          admins={admins}
          userCache={userCache}
          renderComplex={renderComplex}
        />
      </div>

      <div className="card-top">
        <LoanBoardCardDescription
          structures={structures}
          selectedStructure={selectedStructure}
        />
        <LoanBoardCardTasks
          nextDueDate={nextDueDate}
          renderComplex={renderComplex}
        />
      </div>

      {promotion && <div className="card-bottom">{promotion}</div>}
    </div>
  );
};

export default React.memo(LoanBoardCard);
