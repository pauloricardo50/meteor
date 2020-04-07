import { activity } from '../fragments';
import Activities from './activities';
import { ACTIVITY_QUERIES } from './activityConstants';

export const adminActivities = Activities.createQuery(
  ACTIVITY_QUERIES.ADMIN_ACTIVITIES,
  { ...activity(), $options: { sort: { date: 1 } } },
);
