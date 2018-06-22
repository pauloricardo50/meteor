import Loans from '..';
import { LOAN_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.SIDENAV_LOANS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  name: 1,
  createdAt: 1,
  updatedAt: 1,
  user: {
    assignedEmployee: { emails: 1 },
  },
});
