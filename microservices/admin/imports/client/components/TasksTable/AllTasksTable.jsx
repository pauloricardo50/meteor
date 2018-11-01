import { compose, withProps } from 'recompose';

import query from 'core/api/tasks/queries/tasks';
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
  withProps(({ tasks }) => {
    console.log('tasks', tasks);

    return {};
  }),
  makeTableFiltersContainer(undefined, 'tasks'),
)(TasksTable);
