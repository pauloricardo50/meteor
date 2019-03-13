import { Users } from '../..';
import { ROLES, USER_QUERIES } from '../../constants';
import { organisationUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.PROS, {
  $filter({ filters }) {
    filters.roles = { $in: [ROLES.PRO] };
  },
  ...organisationUser(),
});
