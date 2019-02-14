import adminUser from 'core/api/users/queries/adminUser';
import { withSmartQuery } from 'core/api/containerToolkit';

export default withSmartQuery({
  query: adminUser,
  params: ({ match }) => ({ _id: match.params.userId }),
  queryOptions: { reactive: false, single: true },
  dataName: 'user',
});
