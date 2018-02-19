import { Users } from '../../';
import { QUERY } from '../userConstants';

export default Users.createQuery(QUERY.ADMIN_USERS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  emails: 1,
  createdAt: 1,
  roles: 1,
});
