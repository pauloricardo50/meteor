import { Users } from '../../';
import { USER_QUERIES, ROLES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.ADMIN_USERS, {
  $filter({ filters, options, params }) {
    const { assignedTo, searchQuery } = params;
    if (assignedTo) {
      filters.assignedEmployeeId = assignedTo;
    }
    // filters.roles = { $nin: [ROLES.DEV] };
    filters.roles = { $in: [ROLES.ADMIN, ROLES.USER] };
    if (searchQuery) {
      filters.$or = [
        {
          emails: {
            $elemMatch: {
              address: {
                $regex: searchQuery,
              },
            },
          },
        },
        { 'profile.organization': { $regex: searchQuery } },
      ];
    }
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
