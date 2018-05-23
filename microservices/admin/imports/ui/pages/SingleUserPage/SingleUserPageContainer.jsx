import query from 'core/api/users/queries/adminUser';
import { withSmartQuery } from 'core/api/containerToolkit';

export default withSmartQuery({
  query: ({ match }) => query.clone({ _id: match.params.userId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'user',
});
