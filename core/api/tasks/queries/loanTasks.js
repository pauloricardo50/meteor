import { Tasks } from '../../';
import { TASK_QUERIES, TASK_STATUS } from '../taskConstants';

export default Tasks.createQuery(TASK_QUERIES.LOAN_TASKS_LIST, {
  $filter({ filters, options, params }) {
    filters.status = { $in: [TASK_STATUS.ACTIVE, TASK_STATUS.COMPLETED] };

    if (params.loanId) {
      filters.loanId = params.loanId;
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
