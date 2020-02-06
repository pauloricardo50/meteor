//
import React, { useEffect } from 'react';

import Timeline from 'core/components/Timeline';
import TimelineDescription from 'core/components/Timeline/TimelineDescription';
import TimelineTitle from 'core/components/Timeline/TimelineTitle';
import UserActivitiesContainer from './UserActivitiesContainer';

const UserActivities = ({ activities = [] }) => {
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
        events={activities.map(activity => {
          const { title, date } = activity;
          return {
            mainLabel: (
              <TimelineTitle title={title} date={date} icon="computer" />
            ),
            secondaryLabel: (
              <TimelineDescription
                activity={activity}
                className="user-activity-description"
              />
            ),
          };
        })}
      />
    </div>
  );
};

export default UserActivitiesContainer(UserActivities);
