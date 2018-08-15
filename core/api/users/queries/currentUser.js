import { Meteor } from 'meteor/meteor';
import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { fullUser } from './userFragments';

export default Users.createQuery(USER_QUERIES.CURRENT_USER, {
  $filter({ filters, options, params }) {
    filters._id = Meteor.userId();
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  ...fullUser,
});
