import { Tasks } from '../..';
import { TASK_QUERIES, TASK_STATUS } from '../taskConstants';
import { taskFragment } from './taskFragments';

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
  ...taskFragment,
});
