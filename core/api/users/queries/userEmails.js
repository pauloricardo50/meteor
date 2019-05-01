import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.USER_EMAILS, {
  $filter({ filters, params: { _id } }) {
    filters._id = _id;
  },
  sentEmails: 1,
});
