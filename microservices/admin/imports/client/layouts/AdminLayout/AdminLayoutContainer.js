import query from 'core/api/users/queries/currentUser';
import { withSmartQuery } from 'core/api/containerToolkit/';

export default withSmartQuery({
  query: () => query.clone({}),
  queryOptions: { reactive: true, single: true },
  dataName: 'currentUser',
  renderMissingDoc: false,
});
