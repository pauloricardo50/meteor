import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { adminUsers } from 'core/api/users/queries';

export default compose(
  withRouter,
  withSmartQuery({
    query: adminUsers,
    params: ({ match, userId }) => ({ _id: userId || match.params.userId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'user',
  }),
);
