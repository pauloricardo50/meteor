import { Meteor } from 'meteor/meteor';
import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { proUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.PRO_USER, {
  $filter({ filters }) {
    filters._id = Meteor.userId();
  },
  ...proUser(),
});
