import query from 'core/api/users/queries/adminUser';
import { withQuery } from 'meteor/cultofcoders:grapher-react';

const SingleUserPageContainer = withQuery(
  ({ match }) => query.clone({ _id: match.params.userId }),
  { reactive: true, single: true },
);

export default SingleUserPageContainer;
