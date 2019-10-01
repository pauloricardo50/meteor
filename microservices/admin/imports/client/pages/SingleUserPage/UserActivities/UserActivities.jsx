// @flow
import React, { useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import Timeline from 'core/components/Timeline';
import UserActivitiesContainer from './UserActivitiesContainer';
import UserActivityTitle from './UserActivityTitle';
import UserActivityDescription from './UserActivityDescription';

type UserActivitiesProps = {
  activities: Array,
};

const now = new Date();

const UserActivities = ({ activities = [] }: UserActivitiesProps) => {
  useEffect(() => {
    const el = document.getElementsByClassName('user-activities-timeline')[0];
    el.scrollLeft = el.scrollWidth;
  }, []);
  const elementAfterToday = activities.find(({ date }) => date.getTime() > now.getTime());

  return (
    <Timeline
      variant="horizontal"
      className="user-activities-timeline"
      events={activities.map(activity => ({
        children: elementAfterToday
          && activities.length >= 2
          && activity._id === elementAfterToday._id && (
          <div className="today">
            <Tooltip title="Aujourd'hui">
              <div className="today-dot" />
            </Tooltip>
          </div>
        ),
        mainLabel: <UserActivityTitle activity={activity} />,
        secondaryLabel: <UserActivityDescription activity={activity} />,
      }))}
    />
  );
};

export default UserActivitiesContainer(UserActivities);
