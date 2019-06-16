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
    user = {},
    nextDueTask = {},
    selectedStructure,
    structures = [],
    promotions = [],
    adminNote,
    tasks,
  } = loan;
  const assignee = user && user.assignedEmployeeCache;
  const promotion = promotions[0] && promotions[0].name;

  return (
    <div
      className="loan-board-card card1 card-hover animated bounceIn"
      style={style}
      onClick={() => setLoanId(loanId)}
      onMouseEnter={() => setRenderComplex(true)}
      onMouseLeave={() => setRenderComplex(false)}
    >
      <div className="card-header">
        <LoanBoardCardTop
          status={status}
          loanId={loanId}
          name={name}
          assignee={assignee}
          admins={admins}
          user={user}
          renderComplex={renderComplex}
        />
      </div>

      <div className="card-top">
        <LoanBoardCardDescription
          structures={structures}
          selectedStructure={selectedStructure}
          adminNote={adminNote}
        />
        <LoanBoardCardTasks
          nextDueTask={nextDueTask}
          renderComplex={renderComplex}
          tasks={tasks}
        />
      </div>

      {promotion && <div className="card-bottom">{promotion}</div>}
    </div>
  );
};

export default React.memo(LoanBoardCard);
