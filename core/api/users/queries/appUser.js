import { Meteor } from 'meteor/meteor';
import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { appUser } from './userFragments';

export default Users.createQuery(USER_QUERIES.APP_USER, {
  $filter({ filters }) {
    filters._id = Meteor.userId();
  },
  $options: { sort: { createdAt: -1 } },
  ...appUser,
});
