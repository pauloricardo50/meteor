import query from 'core/api/users/queries/adminUsersList';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import UsersPage from './UsersPage';

const UsersPageContainer = withQuery(() => query.clone(), {
    reactive: true
})(UsersPage);

export default UsersPageContainer;
