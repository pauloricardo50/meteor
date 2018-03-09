import query from 'core/api/tasks/queries/tasks';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import { Tracker } from 'meteor/tracker';
import TasksTable from './TasksTable';

const TasksTableWithData = withQuery(props => query.clone({ ...props }), {
  reactive: true,
})(TasksTable);

const subscriptionHandle = query.subscribe();

Tracker.autorun(() => {
  if (subscriptionHandle.ready()) {
    query.unsubscribe();
  }
});

export default TasksTableWithData;
