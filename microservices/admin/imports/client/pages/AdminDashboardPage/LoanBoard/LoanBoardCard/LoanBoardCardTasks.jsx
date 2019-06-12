// @flow
import React from 'react';
import moment from 'moment';
import cx from 'classnames';

type LoanBoardCardTasksProps = {};

const LoanBoardCardTasks = ({
  nextDueTask,
  tasks,
}: LoanBoardCardTasksProps) => {
  if (!nextDueTask.dueAt) {
    return null;
  }

  const dueAtMoment = nextDueTask.dueAt && moment(nextDueTask.dueAt);
  const isLate = dueAtMoment && dueAtMoment < moment();

  return (
    <>
      <hr />
      <h5 className="loan-board-card-tasks">
        <span className={cx({ 'error-box': isLate, secondary: !isLate })}>
          {dueAtMoment.fromNow()}
        </span>
        :&nbsp;
        <span>{nextDueTask.title}</span>
      </h5>
    </>
  );
};

export default React.memo(LoanBoardCardTasks);
