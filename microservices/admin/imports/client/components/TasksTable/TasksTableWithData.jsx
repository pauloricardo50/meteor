import { compose } from 'recompose';

import query from 'core/api/tasks/queries/tasks';
import { withSmartQuery } from 'core/api';
import withTableFilters from 'core/containers/withTableFilters';
import TasksTable from './TasksTable';

export const withTasksQuery = withSmartQuery({
  query,
  params: ({ assignedTo, unassigned, dashboardTasks }) => ({
    assignedTo,
    unassigned,
    dashboardTasks,
  }),
  queryOptions: { reactive: false },
});

export const TasksTableContainer = compose(
  withTasksQuery,
  withTableFilters,
);

export default TasksTableContainer(TasksTable);
