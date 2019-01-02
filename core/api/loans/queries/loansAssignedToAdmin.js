import { Users } from '../..';
import { adminLoan } from '../../fragments';
import { LOAN_QUERIES } from '../loanConstants';

export default Users.createQuery(LOAN_QUERIES.LOANS_ASSIGNED_TO_ADMIN, {
  $filter({ filters, params: { adminId } }) {
    filters.assignedEmployeeId = adminId;
  },
  $postFilter: (users = []) =>
    users.reduce((allLoans, { loans }) => [...allLoans, ...(loans || [])], []),
  loans: adminLoan({ withSort: true }),
});
