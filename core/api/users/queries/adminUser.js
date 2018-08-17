import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import { adminUserFragment } from './userFragments';

export default Users.createQuery(USER_QUERIES.ADMIN_USER, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $postFilter: users =>
    users.map(({ loans, ...user }) => ({
      ...user,
      loans: loans.map(formatLoanWithStructure),
    })),
  ...adminUserFragment,
});
