import Users from '../users';
import { USER_QUERIES } from '../userConstants';
import { fullUser } from './userFragments';

export default Users.createQuery(USER_QUERIES.SIDENAV_USERS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  ...fullUser,
});
