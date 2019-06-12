// @flow
import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import StickyPopover from 'core/components/StickyPopover';
import Timeline from 'core/components/Timeline';
import { TASK_STATUS } from 'imports/core/api/constants';

type LoanBoardCardTasksProps = {};

const LoanBoardCardTasks = ({
  nextDueTask,
  tasks,
}: LoanBoardCardTasksProps) => {
  const renderComplex = true;
  if (!nextDueTask._id) {
    return null;
  }

  const dueAtMoment = nextDueTask.dueAt && moment(nextDueTask.dueAt);
  const isLate = nextDueTask.noDueDate || dueAtMoment < moment();

  const task = (
    <h5 className="loan-board-card-tasks">
      <span className={cx({ 'error-box': isLate, secondary: !isLate })}>
        {nextDueTask.noDueDate ? 'Maintenant' : dueAtMoment.fromNow()}
      </span>
      :&nbsp;
      <span>{nextDueTask.title}</span>
    </h5>
  );
  const activeTasks = tasks.filter(({ status }) => status === TASK_STATUS.ACTIVE);
  const sortedTasks = activeTasks.sort(({ dueAt: dueA }, { dueAt: dueB }) => {
    if (!dueA) {
      return -1;
    }
    if (!dueB) {
      return 1;
    }

    return dueA - dueB;
  });

  return (
    <>
      <hr />
      {renderComplex ? (
        <StickyPopover
          title="Tâches"
          component={(
            <Timeline
              id={tasks[0]._id}
              className="tasks"
              events={sortedTasks.map(({ title, dueAt }) => ({
                leftLabel: !dueAt ? (
                  <span className="error-box">Maintenant</span>
                ) : (
                  <span className="secondary">{moment(dueAt).fromNow()}</span>
                ),
                rightLabel: title,
              }))}
            />
          )}
        >
          {task}
        </StickyPopover>
      ) : (
        task
      )}
    </>
  );
};

export default React.memo(LoanBoardCardTasks);
