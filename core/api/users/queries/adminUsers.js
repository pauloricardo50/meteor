import { Users } from '../../';
import { USER_QUERIES, ROLES } from '../userConstants';
import { createRegexQuery } from '../../helpers/mongoHelpers';

export default Users.createQuery(USER_QUERIES.ADMIN_USERS, {
  $filter({ filters, params: { assignedTo, searchQuery } }) {
    if (assignedTo) {
      filters.assignedEmployeeId = assignedTo;
    }
    // filters.roles = { $nin: [ROLES.DEV] };
    filters.roles = { $in: [ROLES.ADMIN, ROLES.USER] };
    if (searchQuery) {
      filters.$or = [
        { emails: { $elemMatch: createRegexQuery('address', searchQuery) } },
        createRegexQuery('profile.organization', searchQuery),
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
