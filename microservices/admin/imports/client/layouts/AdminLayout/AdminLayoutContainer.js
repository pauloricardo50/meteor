// @flow
import { compose } from 'recompose';
import currentUser from 'core/api/users/queries/currentUser';
import { withSmartQuery } from 'core/api/containerToolkit';

export default compose(withSmartQuery({
  query: currentUser,
  params: () => ({}),
  queryOptions: { reactive: true, single: true },
  dataName: 'currentUser',
  renderMissingDoc: false,
}));
