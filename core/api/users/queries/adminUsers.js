import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { adminUserFragment } from './userFragments';

export default Users.createQuery(USER_QUERIES.ADMIN_USERS, {
  $filter({ filters, params: { assignedTo } }) {
    if (assignedTo) {
      filters.assignedEmployeeId = assignedTo;
    }
  },
  ...adminUserFragment,
});
