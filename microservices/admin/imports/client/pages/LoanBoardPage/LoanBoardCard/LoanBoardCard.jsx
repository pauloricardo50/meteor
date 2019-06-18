// @flow
import React, { useState } from 'react';

import LoanBoardCardTop from './LoanBoardCardTop';
import LoanBoardCardTasks from './LoanBoardCardTasks';
import LoanBoardCardDescription from './LoanBoardCardDescription';
import LoanBoardCardBottom from './LoanBoardCardBottom';

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
    adminNote,
    customName,
    name,
    nextDueTask = {},
    promotions = [],
    properties = [],
    selectedStructure,
    status,
    structures = [],
    tasksCache: tasks,
    user = {},
  } = loan;
  const structure = structures.find(({ id }) => id === selectedStructure);

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
          admins={admins}
          user={user}
          renderComplex={renderComplex}
        />
      </div>

      <div className="card-top">
        <LoanBoardCardDescription structure={structure} adminNote={adminNote} />
        <LoanBoardCardTasks
          nextDueTask={nextDueTask}
          renderComplex={renderComplex}
          tasks={tasks}
        />
      </div>

      <LoanBoardCardBottom
        promotions={promotions}
        properties={properties}
        customName={customName}
        structure={structure}
      />
    </div>
  );
};

export default React.memo(LoanBoardCard);
