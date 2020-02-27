import React, { useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import Timeline from 'core/components/Timeline';
import TimelineDescription from 'core/components/Timeline/TimelineDescription';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import Checkbox from 'core/components/Checkbox';
import LoanActivityAdder from './LoanActivityAdder';
import LoanTimelineContainer, {
  activityFilterOptions,
} from './LoanTimelineContainer';
import LoanTimelineTitle from './LoanTimelineTitle';

const now = new Date();

const LoanTimeline = ({
  loanId,
  activities = [],
  type,
  setType,
  fetchTasks,
  setFetchTasks,
  fetchConversations,
  setFetchConversations,
}) => {
  useEffect(() => {
    const el = document.getElementsByClassName('loan-timeline-timeline')[0];
    el.scrollLeft = el.scrollWidth;
  }, []);
  const elementAfterToday = activities.find(
    ({ date }) => date.getTime() > now.getTime(),
  );

  return (
    <div className="loan-timeline">
      <div className="flex">
        <h2>Activité</h2>
        <LoanActivityAdder loanId={loanId} />
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
        <Checkbox
          onChange={() => setFetchConversations(!fetchConversations)}
          value={fetchConversations}
          label="Front"
        />
      </div>
      <Timeline
        variant="horizontal"
        className="loan-timeline-timeline"
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
          mainLabel: <LoanTimelineTitle activity={activity} />,
          secondaryLabel: (
            <TimelineDescription
              activity={activity}
              className="loan-timeline-description"
            />
          ),
        }))}
      />
    </div>
  );
};

export default LoanTimelineContainer(LoanTimeline);
