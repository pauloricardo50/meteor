import { Users } from '../../';
import { USER_QUERIES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.ADMINS, {
  $filter({ filters, options, params }) {
    filters.roles = { $in: ['admin'] };
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  emails: 1,
  firstName: 1,
  lastName: 1,
  username: 1,
});
