import query from 'core/api/tasks/queries/tasksList';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import TasksTab from './TasksTable';

<<<<<<< HEAD:microservices/admin-temp/imports/ui/pages/TasksPage/TasksTabContainer.jsx
const TasksTabContainer = withQuery(
=======
const TasksTabWithData = withQuery(
>>>>>>> 733e1f7da36ba6c9828562ed1068b279480cd770:microservices/admin-temp/imports/ui/pages/TasksPage/TasksTabWithData.jsx
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

<<<<<<< HEAD:microservices/admin-temp/imports/ui/pages/TasksPage/TasksTabContainer.jsx
export default TasksTabContainer;
=======
export default TasksTabWithData;
>>>>>>> 733e1f7da36ba6c9828562ed1068b279480cd770:microservices/admin-temp/imports/ui/pages/TasksPage/TasksTabWithData.jsx
