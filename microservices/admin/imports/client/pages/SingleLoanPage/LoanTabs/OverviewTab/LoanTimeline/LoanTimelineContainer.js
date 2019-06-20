import { compose } from 'recompose';

import { withSmartQuery } from 'core/api';
import { adminActivities } from 'core/api/activities/queries';

export default compose(withSmartQuery({
  query: adminActivities,
  params: ({ loanId }) => ({ loanId }),
  dataName: 'activities',
}));
