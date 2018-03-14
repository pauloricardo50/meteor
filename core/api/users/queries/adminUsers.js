import { Users } from '../../';
import { USER_QUERIES, ROLES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.ADMIN_USERS, {
  $filter({ filters, options, params }) {
    if (params.assignedTo) {
      filters.assignedEmployeeId = params.assignedTo;
    }

    filters.roles = { $nin: [ROLES.DEV] };
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  emails: 1,
  createdAt: 1,
  roles: 1,
  assignedEmployee: {
    emails: 1,
    roles: 1,
    username: 1,
  },
});
