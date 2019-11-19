import { Migrations } from 'meteor/percolate:migrations';

import { ACTIVITY_TYPES } from '../../activities/activityConstants';
import Activities from '../../activities';
import ActivityService from '../../activities/server/ActivityService';

export const up = () => {
  const allServerActivities = ActivityService.fetch({
    $filters: { type: 'SERVER' },
    secondaryType: 1,
  });

  return Promise.all(
    allServerActivities.map(({ _id, secondaryType }) =>
      Activities.rawCollection().update(
        { _id },
        {
          $unset: { secondaryType: true },
          $set: {
            type: ACTIVITY_TYPES.EVENT,
            isServerGenerated: true,
            metadata: { event: secondaryType },
          },
        },
      ),
    ),
  );
};

export const down = () => {
  const allServerActivities = ActivityService.fetch({
    $filters: { isServerGenerated: true },
    metadata: 1,
  });

  return Promise.all(
    allServerActivities.map(({ _id, metadata: { event } = {} }) =>
      Activities.rawCollection().update(
        { _id },
        {
          $unset: { isServerGenerated: true, metadata: true },
          $set: { type: 'SERVER', secondaryType: event },
        },
      ),
    ),
  );
};

Migrations.add({
  version: 22,
  name: 'Remove SERVER event type and add metadata',
  up,
  down,
});
