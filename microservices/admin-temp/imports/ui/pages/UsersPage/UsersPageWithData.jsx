import query from 'core/api/users/queries/adminUsers';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import UsersPage from './UsersPage';

const UsersPageWithData = withQuery(() => query.clone(), {
  reactive: true,
})(UsersPage);

export default UsersPageWithData;
