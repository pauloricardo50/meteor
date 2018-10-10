import { Meteor } from 'meteor/meteor';
import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { proUserFragment } from './userFragments';

export default Users.createQuery(USER_QUERIES.PRO_USER, {
  $filter({ filters }) {
    console.log('proUser!');

    filters._id = Meteor.userId();
  },
  ...proUserFragment,
});
