import { Tasks } from '../../';
import { TASK_QUERIES, TASK_STATUS } from '../taskConstants';

export default Tasks.createQuery(TASK_QUERIES.LOAN_TASKS, {
  $filter({ filters, params: { borrowerIds, loanId, propertyId } }) {
    const status = { $in: [TASK_STATUS.ACTIVE, TASK_STATUS.COMPLETED] };

    const relatedToLoanOrBorrowersOrProperty = [
      { loanId },
      { borrowerId: { $in: borrowerIds } },
      { propertyId },
    ];

    filters.$and = [{ status }, { $or: relatedToLoanOrBorrowersOrProperty }];
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
    firstName: 1,
    lastName: 1,
  },
  user: {
    emails: 1,
    username: 1,
    firstName: 1,
    lastName: 1,
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
