import React, { useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import Timeline from 'core/components/Timeline';
import TimelineDescription from 'core/components/Timeline/TimelineDescription';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import Checkbox from 'core/components/Checkbox';
import AdminTimelineContainer, {
  activityFilterOptions,
} from './AdminTimelineContainer';
import AdminActivityAdder from './AdminActivityAdder';
import AdminTimelineTitle from './AdminTimelineTitle';

const now = new Date();

const AdminTimeline = ({
  docId,
  activities = [],
  type,
  setType,
  fetchTasks,
  setFetchTasks,
  fetchConversations,
  setFetchConversations,
  frontTagId,
  withActivityAdder = true,
  AdditionalFilters,
  ActivityDescription,
  ActivityTitle,
  CustomActivityAdder,
  collection,
  activitiesFilter,
}) => {
  useEffect(() => {
    const el = document.getElementsByClassName('admin-timeline-timeline')[0];
    el.scrollLeft = el.scrollWidth;
  }, []);

  const elementAfterToday = activities.find(
    ({ date }) => date.getTime() > now.getTime(),
  );

  return (
    <div className="admin-timeline">
      <div className="flex center-align mb-16">
        <h2>Activité</h2>
        {withActivityAdder &&
          (CustomActivityAdder || (
            <AdminActivityAdder
              docId={docId}
              collection={collection}
              activitiesFilter={activitiesFilter}
            />
          ))}
        <Select
          value={type.$in}
          multiple
          label="Filtrer"
          options={activityFilterOptions.map(t => ({
            id: t,
            label: <T id={`Forms.type.${t}`} />,
          }))}
          onChange={selected => setType({ $in: selected })}
        />
        <Checkbox
          onChange={() => setFetchTasks(!fetchTasks)}
          value={fetchTasks}
          label="Tâches"
          className="ml-8"
        />
        {frontTagId && (
          <Checkbox
            onChange={() => setFetchConversations(!fetchConversations)}
            value={fetchConversations}
            label="Front"
          />
        )}
        {AdditionalFilters}
      </div>
      <Timeline
        variant="horizontal"
        className="admin-timeline-timeline"
        events={activities.map(activity => ({
          children: elementAfterToday &&
            activities.length >= 2 &&
            activity._id === elementAfterToday._id && (
              <div className="today">
                <Tooltip title="Aujourd'hui">
                  <div className="today-dot" />
                </Tooltip>
              </div>
            ),
          mainLabel: ActivityTitle ? (
            React.cloneElement(ActivityTitle, { activity })
          ) : (
            <AdminTimelineTitle activity={activity} />
          ),
          secondaryLabel: ActivityDescription ? (
            React.cloneElement(ActivityDescription, {
              activity,
              className: 'admin-timeline-description',
            })
          ) : (
            <TimelineDescription
              activity={activity}
              className="admin-timeline-description"
            />
          ),
        }))}
      />
    </div>
  );
};

export default AdminTimelineContainer(AdminTimeline);
