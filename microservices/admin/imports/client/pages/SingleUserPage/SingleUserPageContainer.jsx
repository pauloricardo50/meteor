import query from 'core/api/users/queries/adminUser';
import { withSmartQuery } from 'core/api/containerToolkit';

export default withSmartQuery({
  query,
  params: ({ match }) => ({ _id: match.params.userId }),
  queryOptions: { reactive: false, single: true },
  dataName: 'user',
});
