// @flow
import React, { useState } from 'react';

import { Meteor } from 'meteor/meteor';
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
    borrowers,
    category,
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
          admins={admins}
          borrowers={borrowers}
          loanId={loanId}
          name={name}
          renderComplex={renderComplex}
          status={status}
          user={user}
        />
      </div>

      <div className="card-top">
        <LoanBoardCardDescription structure={structure} adminNote={adminNote} />
        <LoanBoardCardTasks
          nextDueTask={nextDueTask}
          renderComplex={renderComplex}
          tasks={tasks.filter(({ isPrivate = false, assigneeLink: { _id: assigneeId } = {} }) =>
            (isPrivate && assigneeId ? assigneeId === Meteor.userId() : true))}
        />
      </div>

      <LoanBoardCardBottom
        category={category}
        promotions={promotions}
        properties={properties}
        customName={customName}
        structure={structure}
        renderComplex={renderComplex}
      />
    </div>
  );
};

export default React.memo(LoanBoardCard);
