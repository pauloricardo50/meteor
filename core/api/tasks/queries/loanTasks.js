import { Tasks } from '../..';
import { TASK_QUERIES, TASK_STATUS } from '../taskConstants';
import { taskFragment } from './taskFragments';

export default Tasks.createQuery(TASK_QUERIES.LOAN_TASKS, {
  $filter({ filters, params: { borrowerIds, loanId, propertyIds } }) {
    const relatedToLoanOrBorrowersOrProperty = [
      { loanId },
      { borrowerId: { $in: borrowerIds } },
      { propertyId: { $in: propertyIds } },
    ];

    filters.$or = relatedToLoanOrBorrowersOrProperty;
  },
  ...taskFragment,
});
