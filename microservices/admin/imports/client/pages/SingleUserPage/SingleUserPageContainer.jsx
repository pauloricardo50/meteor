import { adminUsers } from 'core/api/users/queries';
import { withSmartQuery } from 'core/api/containerToolkit';

export default withSmartQuery({
  query: adminUsers,
  params: ({ match }) => ({ _id: match.params.userId }),
  queryOptions: { reactive: false, single: true },
  dataName: 'user',
});
