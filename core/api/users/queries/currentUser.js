import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { fullUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.CURRENT_USER, fullUser(), {
  scoped: true,
});
