import { Users } from '../../';
import { USER_QUERIES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.ADMIN_USERS, {
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
