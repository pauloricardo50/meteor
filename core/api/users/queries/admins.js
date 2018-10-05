import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../..';
import { ROLES } from '../../constants';
import { USER_QUERIES } from '../userConstants';
import { simpleUserFragment } from './userFragments';

export default Users.createQuery(USER_QUERIES.ADMINS, {
  $filter({ filters, options, params }) {
    const userIsDev = Roles.userIsInRole(Meteor.user(), ROLES.DEV);

    if (userIsDev) {
      filters.roles = { $in: [ROLES.ADMIN, ROLES.DEV] };
    } else {
      filters.roles = { $in: [ROLES.ADMIN] };
    }
  },
  ...simpleUserFragment,
});
