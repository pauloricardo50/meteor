import { Tasks } from '../../';
import { TASK_QUERIES } from '../taskConstants';

export default Tasks.createQuery(TASK_QUERIES.TASKS, {
  $filter({ filters, options, params }) {
    if (params.assignedTo) {
      filters.assignedEmployeeId = params.assignedTo;
    }
    if (params.unassigned) {
      filters.assignedEmployeeId = { $exists: false };
    }
    if (params.dashboardTasks) {
      delete filters.assignedEmployeeId;
      filters.$or = [
        { assignedEmployeeId: { $in: [params.assignedTo] } },
        { assignedEmployeeId: { $exists: false } },
      ];
    }
    if (params.all) {
      filters._id = { $ne: '' };
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
    user: {
      assignedEmployeeId: 1,
    },
  },
  loan: {
    user: {
      assignedEmployeeId: 1,
    },
  },
  property: {
    user: {
      assignedEmployeeId: 1,
    },
  },
  userId: 1,
});
