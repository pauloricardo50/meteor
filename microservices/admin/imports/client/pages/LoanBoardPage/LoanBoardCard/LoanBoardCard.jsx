//      
import React, { useState } from 'react';

import { Meteor } from 'meteor/meteor';
import LoanBoardCardTop from './LoanBoardCardTop';
import LoanBoardCardTasks from './LoanBoardCardTasks';
import LoanBoardCardDescription from './LoanBoardCardDescription';
import LoanBoardCardBottom from './LoanBoardCardBottom';

                             

const LoanBoardCard = ({
  data: loan,
  setLoanId,
  style,
  admins,
}                    ) => {
  const [renderComplex, setRenderComplex] = useState(false);
  const {
    _id: loanId,
    adminNotes = [],
    category,
    customName,
    nextDueTask = {},
    promotions = [],
    properties = [],
    selectedStructure,
    structures = [],
    tasksCache: tasks,
    selectedLenderOrganisation,
  } = loan;
  const structure = structures.find(({ id }) => id === selectedStructure);
  const adminNote = adminNotes[0] && adminNotes[0].note;

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
          renderComplex={renderComplex}
          loan={loan}
        />
      </div>

      <div className="card-top">
        <LoanBoardCardDescription
          structure={structure}
          adminNote={adminNote}
          selectedLenderOrganisation={selectedLenderOrganisation}
        />
        <LoanBoardCardTasks
          nextDueTask={nextDueTask}
          renderComplex={renderComplex}
          tasks={tasks.filter(
            ({ isPrivate = false, assigneeLink: { _id: assigneeId } = {} }) =>
              isPrivate && assigneeId ? assigneeId === Meteor.userId() : true,
          )}
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
