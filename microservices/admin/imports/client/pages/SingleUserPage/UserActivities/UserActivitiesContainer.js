import { withSmartQuery } from 'core/api/containerToolkit';
import { adminActivities } from 'core/api/activities/queries';

export default withSmartQuery({
  query: adminActivities,
  params: ({ userId }) => ({ userId }),
  dataName: 'activities',
});
