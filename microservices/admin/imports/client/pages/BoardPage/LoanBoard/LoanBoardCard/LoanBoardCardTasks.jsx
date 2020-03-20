import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import StickyPopover from 'core/components/StickyPopover';
import Timeline from 'core/components/Timeline';
import { TASK_STATUS } from 'core/api/constants';
import LoanBoardCardTask from './LoanBoardCardTask';

const sortTasks = ({ dueAt: dueA }, { dueAt: dueB }) => {
  if (!dueA) {
    return -1;
  }
  if (!dueB) {
    return 1;
  }

  return dueA - dueB;
};

const LoanBoardCardTasks = ({ nextDueTask, tasks, renderComplex }) => {
  if (!nextDueTask._id) {
    return null;
  }

  const dueAtMoment = nextDueTask.dueAt && moment(nextDueTask.dueAt);
  const isLate = nextDueTask.noDueDate || dueAtMoment < moment();

  const task = (
    <h5 className="loan-board-card-tasks">
      <span className={cx('date', { 'error-box': isLate, secondary: !isLate })}>
        {nextDueTask.noDueDate ? 'Maintenant' : dueAtMoment.fromNow()}
      </span>
      &nbsp;
      <LoanBoardCardTask title={nextDueTask.title} _id={nextDueTask._id} />
    </h5>
  );
  const activeTasks = tasks.filter(
    ({ status }) => status === TASK_STATUS.ACTIVE,
  );
  const sortedTasks = activeTasks.sort(sortTasks);

  return (
    <>
      <hr />
      {renderComplex ? (
        <StickyPopover
          title="Tâches"
          component={
            <Timeline
              id={tasks[0]._id}
              className="tasks"
              events={sortedTasks.map(({ title, dueAt, _id }) => ({
                secondaryLabel: !dueAt ? (
                  <span className="error-box">Maintenant</span>
                ) : (
                  <span className="secondary">{moment(dueAt).fromNow()}</span>
                ),
                mainLabel: <LoanBoardCardTask title={title} _id={_id} />,
              }))}
            />
          }
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
