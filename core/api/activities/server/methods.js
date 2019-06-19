import { Meteor } from 'meteor/meteor';

import SecurityService from '../../security';
import {
  activityInsert,
  activityUpdate,
  activityRemove,
} from '../methodDefinitions';
import ActivityService from './ActivityService';
import { ACTIVITY_TYPES } from '../activityConstants';

const allowModification = (activityId) => {
  const { type } = ActivityService.fetchOne({
    $filters: { _id: activityId },
    type: 1,
  });

  return type !== ACTIVITY_TYPES.SERVER;
};

activityInsert.setHandler(({ userId }, { object }) => {
  SecurityService.checkUserIsAdmin(userId);
  return ActivityService.insert(object);
});

activityUpdate.setHandler(({ userId }, { activityId, object }) => {
  SecurityService.checkUserIsAdmin(userId);
  if (!allowModification(activityId)) {
    throw new Meteor.Error("Peut pas changer l'activité générée automatiquement");
  }
  return ActivityService._update({ id: activityId, object });
});

activityRemove.setHandler(({ userId }, { activityId }) => {
  SecurityService.checkUserIsAdmin(userId);
  if (!allowModification(activityId)) {
    throw new Meteor.Error("Peut pas changer l'activité générée automatiquement");
  }
  return ActivityService.remove(activityId);
});
