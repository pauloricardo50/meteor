import query from 'core/api/tasks/queries/tasksList';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import TasksTab from './TasksTable';

const TasksTabContainer = withQuery(
    props => {
        return query.clone({ userId: props.userId });
    },
    {
        reactive: true
    }
)(TasksTab);

const subscriptionHandle = query.subscribe();

Tracker.autorun(() => {
    if (subscriptionHandle.ready()) {
        query.unsubscribe();
    }
});

export default TasksTabContainer;
