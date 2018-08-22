import { Tasks } from '../..';
import { TASK_QUERIES, TASK_STATUS } from '../taskConstants';
import { taskFragment } from './taskFragments';

export default Tasks.createQuery(TASK_QUERIES.LOAN_TASKS, {
  $filter({ filters, params: { borrowerIds, loanId, propertyId } }) {
    const relatedToLoanOrBorrowersOrProperty = [
      { loanId },
      { borrowerId: { $in: borrowerIds } },
      { propertyId },
    ];

    filters.$or = relatedToLoanOrBorrowersOrProperty;
  },
  ...taskFragment,
});
