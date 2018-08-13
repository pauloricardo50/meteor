import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import { loanSummary } from '../../loans/queries/loanFragments';

export default Users.createQuery(USER_QUERIES.ADMIN_USER, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $postFilter(users) {
    return users.map(({ loans, ...user }) => ({
      ...user,
      loans: loans.map(formatLoanWithStructure),
    }));
  },
  roles: 1,
  emails: 1,
  createdAt: 1,
  loans: loanSummary,
  assignedEmployee: {
    emails: 1,
    firstName: 1,
    lastName: 1,
  },
  firstName: 1,
  lastName: 1,
  username: 1,
  phoneNumbers: 1,
});
