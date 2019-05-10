import { compose, withState } from 'recompose';

import { newLoans } from 'core/api/stats/queries';
import { withSmartQuery } from 'core/api/containerToolkit/index';

export default compose(
  withState('period', 'setPeriod', 7),
  withSmartQuery({
    query: newLoans,
    dataName: 'newLoans',
    params: ({ period }) => ({ period }),
    queryOptions: {
      shouldRefetch: (
        { props: { period } },
        { props: { period: newPeriod } },
      ) => period !== newPeriod,
    },
  }),
);
