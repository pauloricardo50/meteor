import { Meteor } from 'meteor/meteor';
import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { fullUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.CURRENT_USER, {
  $filter({ filters }) {
    filters._id = Meteor.userId();
  },
  ...fullUser(),
});
