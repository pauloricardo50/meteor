import { Meteor } from 'meteor/meteor';

import SecurityService from '../../security';
import {
  activityInsert,
  activityUpdate,
  activityRemove,
} from '../methodDefinitions';
import ActivityService from './ActivityService';

const allowModification = (activityId) => {
  const { isServerGenerated } = ActivityService.fetchOne({
    $filters: { _id: activityId },
    isServerGenerated: 1,
  });

  return !isServerGenerated;
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
