import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { adminUser } from 'core/api/fragments';
import { USERS_COLLECTION } from 'core/api/users/userConstants';

export default compose(
  withRouter,
  withSmartQuery({
    query: USERS_COLLECTION,
    params: ({ match, userId }) => ({
      $filters: { _id: userId || match.params.userId },
      ...adminUser(), // TODO: Query less data
    }),
    queryOptions: { reactive: false, single: true },
    dataName: 'user',
  }),
);
