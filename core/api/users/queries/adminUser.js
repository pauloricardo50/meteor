import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { adminUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.ADMIN_USER, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  ...adminUser(),
});
