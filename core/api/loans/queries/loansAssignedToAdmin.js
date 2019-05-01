import { Users } from '../..';
import { adminLoan } from '../../fragments';
import { LOAN_QUERIES } from '../loanConstants';

// FIXME: Should be done with denormalization!
export default Users.createQuery(LOAN_QUERIES.LOANS_ASSIGNED_TO_ADMIN, {
  $postFilter: (users = []) =>
    users.reduce((allLoans, { loans = [] }) => [...allLoans, ...loans], []),
  loans: adminLoan({ withSort: true }),
});
