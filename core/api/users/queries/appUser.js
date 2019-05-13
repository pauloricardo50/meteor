import Users from '..';
import { USER_QUERIES } from '../userConstants';
import { appUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.APP_USER, appUser(), {
  scoped: true,
});
