import { Meteor } from 'meteor/meteor';
import { Users } from '../../';
import { USER_QUERIES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.APP_USER, {
  $filter({ filters }) {
    filters._id = Meteor.userId();
  },
  $options: { sort: { createdAt: -1 } },
  roles: 1,
  emails: 1,
  createdAt: 1,
  updatedAt: 1,
  loans: { _id: 1, name: 1, borrowers: { _id: 1 }, property: { _id: 1 } },
  borrowers: { _id: 1 },
  properties: { _id: 1 },
});
