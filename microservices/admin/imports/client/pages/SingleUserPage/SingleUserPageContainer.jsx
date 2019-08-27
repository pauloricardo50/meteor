import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { adminUsers } from 'core/api/users/queries';
import { withSmartQuery } from 'core/api/containerToolkit';

export default compose(
  withRouter,
  withSmartQuery({
    query: adminUsers,
    params: ({ match }) => ({ _id: match.params.userId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'user',
  }),
);
