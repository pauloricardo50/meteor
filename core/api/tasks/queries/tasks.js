import { Tasks } from '../..';
import { TASK_QUERIES } from '../taskConstants';
import { task } from '../../fragments';

export default Tasks.createQuery(TASK_QUERIES.TASKS, {
  $filter({
    filters,
    params: {
      assignedTo,
      unassigned,
      dashboardTasks,
      file,
      status,
      type,
      user,
    },
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

    if (file) {
      filters.fileKey = file;
    }

    if (status) {
      filters.status = status;
    }

    if (type) {
      filters.type = type;
    }

    if (user) {
      filters.userId = user;
    }
  },
  $paginate: true,
  ...task(),
});
