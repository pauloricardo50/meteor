import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';

export default Users.createQuery(USER_QUERIES.USER_EMAILS, {
  $filter({ filters, params: { userId } }) {
    filters._id = userId;
  },
  sentEmails: 1,
});
