import { Meteor } from 'meteor/meteor';

import React from 'react';

import LoanBoardCardAdditionalInfo from './LoanBoardCardAdditionalInfo';
import LoanBoardCardBottom from './LoanBoardCardBottom';
import LoanBoardCardDescription from './LoanBoardCardDescription';
import LoanBoardCardTasks from './LoanBoardCardTasks';
import LoanBoardCardTop from './LoanBoardCardTop';

const LoanBoardCard = ({ data: loan, renderComplex, additionalFields }) => {
  const {
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
    purchaseType,
  } = loan;
  const structure = structures.find(({ id }) => id === selectedStructure);
  const adminNote = adminNotes[0] && adminNotes[0].note;

  return (
    <>
      <div className="card-header">
        <LoanBoardCardTop renderComplex={renderComplex} loan={loan} />
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
        <LoanBoardCardAdditionalInfo
          loan={loan}
          additionalFields={additionalFields}
        />
      </div>

      <LoanBoardCardBottom
        category={category}
        promotions={promotions}
        properties={properties}
        customName={customName}
        structure={structure}
        renderComplex={renderComplex}
        purchaseType={purchaseType}
      />
    </>
  );
};

export default React.memo(LoanBoardCard);
