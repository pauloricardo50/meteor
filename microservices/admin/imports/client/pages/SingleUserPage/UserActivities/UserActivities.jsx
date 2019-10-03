// @flow
import React, { useEffect } from 'react';

import Timeline from 'core/components/Timeline';
import UserActivitiesContainer from './UserActivitiesContainer';
import UserActivityTitle from './UserActivityTitle';
import UserActivityDescription from './UserActivityDescription';

type UserActivitiesProps = {
  activities: Array,
};

const UserActivities = ({ activities = [] }: UserActivitiesProps) => {
  useEffect(() => {
    const el = document.getElementsByClassName('user-activities-timeline')[0];
    el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div className="flex-col">
      <h2>Activité</h2>
      <Timeline
        variant="horizontal"
        className="user-activities-timeline"
        events={activities.map(activity => ({
          mainLabel: <UserActivityTitle activity={activity} />,
          secondaryLabel: <UserActivityDescription activity={activity} />,
        }))}
      />
    </div>
  );
};

export default UserActivitiesContainer(UserActivities);
