import SecurityService from '../../security';
import {
  activityInsert,
  activityUpdate,
  activityRemove,
} from '../methodDefinitions';
import ActivityService from './ActivityService';

activityInsert.setHandler(({ userId }, { object }) => {
  SecurityService.checkUserIsAdmin(userId);
  return ActivityService.insert(object);
});

activityUpdate.setHandler(({ userId }, { activityId, object }) => {
  SecurityService.checkUserIsAdmin(userId);
  return ActivityService._update({ id: activityId, object });
});

activityRemove.setHandler(({ userId }, { activityId }) => {
  SecurityService.checkUserIsAdmin(userId);
  return ActivityService.remove(activityId);
});
