import { Migrations } from 'meteor/percolate:migrations';

import { ACTIVITY_EVENT_METADATA } from '../../activities/activityConstants';
import Activities from '../../activities';
import ActivityService from '../../activities/server/ActivityService';
import UserService from '../../users/server/UserService';

export const up = () => {
  const allUsers = UserService.fetch({ createdAt: 1 });

  return Promise.all(
    allUsers.map(({ _id: userId, createdAt }) =>
      ActivityService.addCreatedAtActivity({
        createdAt,
        userLink: { _id: userId },
        title: 'Compte créé',
      }),
    ),
  );
};

export const down = () => {
  const allUserCreatedAtActivities = ActivityService.fetch({
    $filters: {
      isServerGenerated: true,
      'metadata.event': ACTIVITY_EVENT_METADATA.CREATED,
      'userLink._id': { $exists: true },
    },
  });

  return Promise.all(
    allUserCreatedAtActivities.map(({ _id }) =>
      Activities.rawCollection().remove({ _id }),
    ),
  );
};

Migrations.add({
  version: 23,
  name: 'Add createdAt activity on users',
  up,
  down,
});
