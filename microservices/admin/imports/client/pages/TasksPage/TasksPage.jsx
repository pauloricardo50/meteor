import React from 'react';
import T from 'core/components/Translation';
import { TASK_TYPE, TASK_STATUS } from 'core/api/constants';
import TasksTableWithData from '../../components/TasksTable/TasksTableWithData';

const tasksTableFilters = {
  filters: { type: true, status: true },
  options: {
    type: Object.values(TASK_TYPE),
    status: Object.values(TASK_STATUS),
  },
};

const TasksPage = () => (
  <section className="mask1 tasks-page" style={{ overflow: 'initial' }}>
    <h1>
      <T id="collections.tasks" />
    </h1>

    <TasksTableWithData tableFilters={tasksTableFilters} />
  </section>
);

export default TasksPage;
