// @flow
import { compose, shouldUpdate } from 'recompose';
import currentUser from 'core/api/users/queries/currentUser';
import { withSmartQuery } from 'core/api/containerToolkit';
import { withFileViewer } from 'core/containers/FileViewerContext';

export default compose(
  withFileViewer,
  shouldUpdate(() => false),
  withSmartQuery({
    query: currentUser,
    params: () => ({
      $body: {
        email: 1,
        emails: 1,
        name: 1,
        organisations: { name: 1 },
        roles: 1,
      },
    }),
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
    renderMissingDoc: false,
  }),
);
