import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { createRegexQuery } from '../../helpers/mongoHelpers';
import { adminUserFragment } from './userFragments';

export default Users.createQuery(USER_QUERIES.ADMIN_USERS, {
  $filter({ filters, params: { assignedTo, searchQuery } }) {
    if (assignedTo) {
      filters.assignedEmployeeId = assignedTo;
    }
    if (searchQuery) {
      filters.$or = [
        createRegexQuery('email', searchQuery),
        createRegexQuery('profile.organization', searchQuery),
      ];
    }
  },
  ...adminUserFragment,
});
