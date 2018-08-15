import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import { adminUser } from './userFragments';

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
  ...adminUser,
});
