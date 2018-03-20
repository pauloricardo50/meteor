import { Users } from '../../';
import { USER_QUERIES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.SIDENAV_USERS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
});
