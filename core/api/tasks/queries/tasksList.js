import { Tasks } from '../../';
import { TASK_QUERIES } from '../tasksConstants';

export default Tasks.createQuery(TASK_QUERIES.TASKS, {
  $filter({ filters, options, params }) {
    if (params.userId) {
      filters.assignedTo = params.userId;
    }
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  status: 1,
  type: 1,
  createdAt: 1,
  updatedAt: 1,
  dueAt: 1,
  assignedUser: {
    emails: 1,
    roles: 1,
    username: 1,
  },
  user: {
    emails: 1,
    username: 1,
  },
  borrower: {
    borrowerAssignee: {
      _id: 1,
    },
  },
  loan: {
    user: {
      _id: 1,
    },
  },
  property: {
    propertyAssignee: {
      _id: 1,
    },
  },
  userId: 1,
});
