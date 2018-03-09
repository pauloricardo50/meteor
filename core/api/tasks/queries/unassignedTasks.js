import { Tasks } from '../../';
import { TASK_QUERIES } from '../tasksConstants';

export default Tasks.createQuery(TASK_QUERIES.UNASSIGNED_TASKS, {
  $filter({ filters, options, params }) {
    filters.assignedTo = undefined;
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
