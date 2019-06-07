import { compose } from 'recompose';

import { tasks as query } from 'core/api/tasks/queries';
import { withSmartQuery } from 'core/api';
import { makeTableFiltersContainer } from 'core/containers/withTableFilters';
import TasksTable from './TasksTable';

export const withTasksQuery = withSmartQuery({
  query,
  params: ({ assignedTo, unassigned, dashboardTasks }) => ({
    assignedTo,
    unassigned,
    dashboardTasks,
  }),
  queryOptions: { reactive: false },
  dataName: 'tasks',
});

export default compose(
  withTasksQuery,
  makeTableFiltersContainer(undefined, 'tasks'),
)(TasksTable);
