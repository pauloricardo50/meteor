import { Users } from '../..';
import { LOAN_QUERIES } from '../loanConstants';
import { adminLoanFragment } from './loanFragments';

export default Users.createQuery(LOAN_QUERIES.LOANS_ASSIGNED_TO_ADMIN, {
  $filter({ filters, params: { adminId } }) {
    filters.assignedEmployeeId = adminId;
  },
  $postFilter: (users) => {
    if (!users) {
      return [];
    }

    if (users.length) {
      return users.reduce(
        (allLoans, { loans }) => [...allLoans, ...(loans || [])],
        [],
      );
    }

    return users.loans || [];
  },
  loans: adminLoanFragment,
});
