import { Users } from '../../';
import { USER_QUERIES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.SIDENAV_USERS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  emails: 1,
  firstName: 1,
  lastName: 1,
  username: 1,
  roles: 1,
  createdAt: 1,
  updatedAt: 1,
  assignedEmployee: { emails: 1 },
});
