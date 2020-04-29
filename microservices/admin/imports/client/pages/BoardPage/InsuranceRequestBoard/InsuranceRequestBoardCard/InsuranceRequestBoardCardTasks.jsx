import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import StickyPopover from 'core/components/StickyPopover';
import Timeline from 'core/components/Timeline';

import InsuranceRequestBoardCardTask from './InsuranceRequestBoardCardTask';

const sortTasks = ({ dueAt: dueA }, { dueAt: dueB }) => {
  if (!dueA) {
    return -1;
  }
  if (!dueB) {
    return 1;
  }

  return dueA - dueB;
};

const InsuranceRequestBoardCardTasks = ({
  nextDueTask,
  tasks,
  renderComplex,
}) => {
  if (!nextDueTask._id) {
    return null;
  }

  const dueAtMoment = nextDueTask.dueAt && moment(nextDueTask.dueAt);
  const isLate = nextDueTask.noDueDate || dueAtMoment < moment();

  const task = (
    <div className="loan-board-card-tasks font-size-body">
      <small
        className={cx('date mr-4', { 'error-box': isLate, secondary: !isLate })}
      >
        {nextDueTask.noDueDate ? 'Maintenant' : dueAtMoment.fromNow()}
      </small>
      <InsuranceRequestBoardCardTask
        title={nextDueTask.title}
        _id={nextDueTask._id}
      />
    </div>
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
                mainLabel: (
                  <InsuranceRequestBoardCardTask title={title} _id={_id} />
                ),
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

export default React.memo(InsuranceRequestBoardCardTasks);
