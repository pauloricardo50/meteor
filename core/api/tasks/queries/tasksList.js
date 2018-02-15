import { Tasks } from '../../';
import { QUERY } from '../tasksConstants';

export default Tasks.createQuery(QUERY.TASKS, {
    $filter({ filters, options, params }) {
        if (params.userId) {
            filters.userId = params.userId;
        }
        //filters.assignedUser.roles = {$in: ['admin']};
    },
    $options: {
        sort: {
            createdAt: -1
        }
    },
    $paginate: true,
    status: 1,
    createdAt: 1,
    updatedAt: 1,
    dueAt: 1,
    assignedUser: {
        emails: 1,
        roles: 1
    }
});
