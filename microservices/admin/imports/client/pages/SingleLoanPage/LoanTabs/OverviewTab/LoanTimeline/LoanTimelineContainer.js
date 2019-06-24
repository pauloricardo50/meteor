import { compose, withState } from 'recompose';

import { withSmartQuery } from 'core/api';
import { adminActivities } from 'core/api/activities/queries';
import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';

const formatType = (type) => {
  if (type.$in && type.$in.includes('COMMUNICATION')) {
    return { $in: [...type.$in, ACTIVITY_TYPES.EMAIL, ACTIVITY_TYPES.PHONE] };
  }
  return type;
};

export const activityFilterOtions = [
  'COMMUNICATION',
  ...Object.values(ACTIVITY_TYPES).filter(type => type !== ACTIVITY_TYPES.EMAIL && type !== ACTIVITY_TYPES.PHONE),
];

export default compose(
  withState('type', 'setType', { $in: activityFilterOtions }),
  withSmartQuery({
    query: adminActivities,
    params: ({ loanId, type }) => ({ loanId, type: formatType(type) }),
    dataName: 'activities',
  }),
);
