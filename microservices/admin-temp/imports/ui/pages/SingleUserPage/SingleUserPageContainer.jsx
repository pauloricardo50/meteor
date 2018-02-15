import query from 'core/api/users/queries/adminUserView';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import SingleUserPage from './SingleUserPage';

const SingleUserPageContainer = withQuery(
    ({ match }) => {
        return query.clone({ _id: match.params.userId });
    },
    {
        reactive: true,
        single: true
    }
)(SingleUserPage);

export default SingleUserPageContainer;
