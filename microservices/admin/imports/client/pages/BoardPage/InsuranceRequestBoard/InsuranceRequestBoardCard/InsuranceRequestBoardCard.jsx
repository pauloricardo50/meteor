import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import InsuranceRequestBoardCardTop from './InsuranceRequestBoardCardTop';
import InsuranceRequestBoardCardDescription from './InsuranceRequestBoardCardDescription';
import InsuranceRequestBoardCardTasks from './InsuranceRequestBoardCardTasks';
import InsuranceRequestBoardCardBottom from './InsuranceRequestBoardCardBottom';

const InsuranceRequestBoardCard = ({
  data: insuranceRequest,
  style,
  setInsuranceRequestId,
}) => {
  const [renderComplex, setRenderComplex] = useState(false);

  const {
    _id: insuranceRequestId,
    insurances = [],
    tasksCache: tasks,
    nextDueTask = {},
    adminNotes,
    customName,
  } = insuranceRequest;
  const adminNote = adminNotes[0] && adminNotes[0].note;

  return (
    <div
      className="loan-board-card card1 card-hover animated bounceIn"
      style={style}
      onClick={() => setInsuranceRequestId(insuranceRequestId)}
      onMouseEnter={() => setRenderComplex(true)}
      onMouseLeave={() => setRenderComplex(false)}
    >
      <div className="card-header">
        <InsuranceRequestBoardCardTop
          renderComplex={renderComplex}
          insuranceRequest={insuranceRequest}
        />
      </div>

      <div className="card-top">
        <InsuranceRequestBoardCardDescription
          insurances={insurances}
          adminNote={adminNote}
        />
        <InsuranceRequestBoardCardTasks
          nextDueTask={nextDueTask}
          renderComplex={renderComplex}
          tasks={tasks.filter(
            ({ isPrivate = false, assigneeLink: { _id: assigneeId } = {} }) =>
              isPrivate && assigneeId ? assigneeId === Meteor.userId() : true,
          )}
        />
      </div>
      <InsuranceRequestBoardCardBottom customName={customName} />
    </div>
  );
};

export default React.memo(InsuranceRequestBoardCard);
