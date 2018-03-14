import query from 'core/api/users/queries/adminUsers';
import { withQuery } from 'core/api';

export default withQuery(props => query.clone({ ...props }), {
  reactive: true,
});
