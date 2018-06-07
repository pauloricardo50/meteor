import { Meteor } from 'meteor/meteor';
import { Users } from '../../';
import { USER_QUERIES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.CURRENT_USER, {
  $filter({ filters, options, params }) {
    filters._id = Meteor.userId();
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  roles: 1,
  emails: 1,
  createdAt: 1,
  updatedAt: 1,
});
