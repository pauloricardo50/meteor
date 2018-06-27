import query from 'core/api/tasks/queries/tasks';
import { withSmartQuery } from 'core/api';
import { Tracker } from 'meteor/tracker';
import { compose } from 'recompose';

import withTableFilters from 'core/containers/withTableFilters';
import TasksTable from './TasksTable';

const TasksTableWithData = compose(
  withSmartQuery({
    query: ({ assignedTo, unassigned, dashboardTasks }) =>
      query.clone({ assignedTo, unassigned, dashboardTasks }),
    queryOptions: { reactive: true },
  }),
  withTableFilters,
)(TasksTable);

const subscriptionHandle = query.subscribe();

Tracker.autorun(() => {
  if (subscriptionHandle.ready()) {
    query.unsubscribe();
  }
});

export default TasksTableWithData;
