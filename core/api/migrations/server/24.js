import { Migrations } from 'meteor/percolate:migrations';

import {
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from '../../activities/activityConstants';
import Activities from '../../activities';
import ActivityService from '../../activities/server/ActivityService';
import UserService from '../../users/server/UserService';

export const up = () => {
  const allVerifiedUsers = UserService.fetch({
    $filters: { 'emails.verified': { $in: [true] } },
    _id: 1,
    createdAt: 1,
  });

  return Promise.all(
    allVerifiedUsers.map(({ _id: userId, createdAt }) =>
      ActivityService.addServerActivity({
        type: ACTIVITY_TYPES.EVENT,
        metadata: { event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION },
        userLink: { _id: userId },
        title: 'Première connexion',
        createdBy: userId,
        date: createdAt,
      }),
    ),
  );
};

export const down = () => {
  const allUserCreatedAtActivities = ActivityService.fetch({
    $filters: {
      isServerGenerated: true,
      'metadata.event': ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
      'userLink._id': { $exists: true },
    },
    _id: 1,
  });

  return Promise.all(
    allUserCreatedAtActivities.map(({ _id }) =>
      Activities.rawCollection().remove({ _id }),
    ),
  );
};

Migrations.add({
  version: 24,
  name: 'Add first connection activity on verified users',
  up,
  down,
});
