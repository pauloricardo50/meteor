import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { simpleUserFragment } from './userFragments';

export default Users.createQuery(USER_QUERIES.ADMINS, {
  $filter({ filters, options, params }) {
    filters.roles = { $in: ['admin'] };
  },
  ...simpleUserFragment,
});
