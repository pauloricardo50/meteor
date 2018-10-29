// @flow
import { compose } from 'recompose';
import query from 'core/api/users/queries/currentUser';
import { withSmartQuery } from 'core/api/containerToolkit';

export default compose(
  withSmartQuery({
    query,
    params: () => ({}),
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
    renderMissingDoc: false,
  }),
);
