import { Tracker } from 'meteor/tracker';

import query from 'core/api/tasks/queries/tasks';
import { Composer, withSmartQuery } from 'core/api';
import withTableFilters from 'core/containers/withTableFilters';

import TasksTable from './TasksTable';

export const withTasksQuery = withSmartQuery({
  query: ({ assignedTo, unassigned, dashboardTasks }) =>
    query.clone({ assignedTo, unassigned, dashboardTasks }),
  queryOptions: { reactive: true },
});

export const TasksTableContainer = Composer.compose(
  withTasksQuery,
  withTableFilters,
);

export default TasksTableContainer(TasksTable);

const subscriptionHandle = query.subscribe();

Tracker.autorun(() => {
  if (subscriptionHandle.ready()) {
    query.unsubscribe();
  }
});
