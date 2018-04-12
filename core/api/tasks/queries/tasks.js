import { Tasks } from '../../';
import { TASK_QUERIES } from '../taskConstants';

export default Tasks.createQuery(TASK_QUERIES.TASKS, {
  $filter({
    filters,
    options,
    params: { assignedTo, unassigned, dashboardTasks },
  }) {
    if (assignedTo) {
      filters.assignedEmployeeId = assignedTo;
    }
    if (unassigned) {
      filters.assignedEmployeeId = { $exists: false };
    }
    if (dashboardTasks) {
      delete filters.assignedEmployeeId;
      filters.$or = [
        { assignedEmployeeId: { $in: [assignedTo] } },
        { assignedEmployeeId: { $exists: false } },
      ];
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
  assignedEmployee: {
    emails: 1,
    roles: 1,
    username: 1,
  },
  user: {
    emails: 1,
    username: 1,
  },
  borrower: {
    firstName: 1,
    lastName: 1,
    user: {
      assignedEmployeeId: 1,
    },
  },
  loan: {
    name: 1,
    user: {
      assignedEmployeeId: 1,
    },
  },
  property: {
    address1: 1,
    user: {
      assignedEmployeeId: 1,
    },
  },
  userId: 1,
});
