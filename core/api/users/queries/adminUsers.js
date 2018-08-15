import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { createRegexQuery } from '../../helpers/mongoHelpers';
import { fullUserFragment } from './userFragments';

export default Users.createQuery(USER_QUERIES.ADMIN_USERS, {
  $filter({ filters, params: { assignedTo, searchQuery } }) {
    if (assignedTo) {
      filters.assignedEmployeeId = assignedTo;
    }
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
  ...fullUserFragment,
});
