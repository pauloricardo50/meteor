import React, { useContext, useMemo, useState } from 'react';
import moment from 'moment';

import { TASK_PRIORITIES, TASK_STATUS } from 'core/api/tasks/taskConstants';
import CurrentUserContext from 'core/containers/CurrentUserContext';

import TasksDataTable from './TasksDataTable';
import TasksTableFilters from './TasksTableFilters';

const getUptoDate = uptoDate => {
  switch (uptoDate) {
    case 'TODAY':
      return moment().endOf('day').toDate();
    case 'TOMORROW':
      return moment().endOf('day').add(1, 'days').endOf('day').toDate();

    default:
      return null;
  }
};

const getQueryFilters = ({ assignee, status, uptoDate }) => {
  let $or;

  if (getUptoDate(uptoDate)) {
    $or = [
      { dueAt: { $lt: getUptoDate(uptoDate) } },
      { dueAt: { $exists: false } },
    ];
  }

  return { 'assigneeLink._id': assignee, status, $or };
};

const TasksDataTableWithPriority = () => {
  const currentUser = useContext(CurrentUserContext);
  const [assignee, setAssignee] = useState({
    $in: [currentUser._id, undefined],
  });
  const [status, setStatus] = useState({ $in: [TASK_STATUS.ACTIVE] });
  const [uptoDate, setUptoDate] = useState('TOMORROW');
  const priorityFilters = useMemo(
    () => ({
      ...getQueryFilters({ assignee, status, uptoDate }),
      priority: TASK_PRIORITIES.HIGH,
    }),
    [assignee, status, uptoDate],
  );
  const defaultFilters = useMemo(
    () => ({
      ...getQueryFilters({ assignee, status, uptoDate }),
      priority: TASK_PRIORITIES.DEFAULT,
    }),
    [assignee, status, uptoDate],
  );

  return (
    <div>
      <TasksTableFilters
        assignee={assignee}
        status={status}
        setStatus={setStatus}
        setAssignee={setAssignee}
        uptoDate={uptoDate}
        setUptoDate={setUptoDate}
      />
      <h3 style={{ marginTop: 40 }}>Prioritaire</h3>
      <TasksDataTable filters={priorityFilters} showRelatedTo />
      <h3 style={{ marginTop: 40 }}>Défaut</h3>
      <TasksDataTable filters={defaultFilters} showRelatedTo />
    </div>
  );
};

export default TasksDataTableWithPriority;
