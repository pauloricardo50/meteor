import Activities from './activity';
import { ACTIVITY_QUERIES } from './activityConstants';
import { activity } from '../fragments';

export const adminActivities = Activities.createQuery(
  ACTIVITY_QUERIES.ADMIN_ACTIVITIES,
  activity(),
);
