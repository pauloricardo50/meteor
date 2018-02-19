import { Users } from '../../';
import { QUERY } from '../userConstants';

export default Users.createQuery(QUERY.ADMINS, {
  $filter({ filters, options, params }) {
    filters.roles = { $in: ['admin'] };
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  emails: 1,
});
