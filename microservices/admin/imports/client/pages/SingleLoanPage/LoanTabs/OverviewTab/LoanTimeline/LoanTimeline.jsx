// @flow
import React, { useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import Timeline from 'core/components/Timeline';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import LoanActivityAdder from './LoanActivityAdder';
import LoanTimelineContainer, {
  activityFilterOptions,
} from './LoanTimelineContainer';
import LoanTimelineTitle from './LoanTimelineTitle';
import LoanTimelineDescription from './LoanTimelineDescription';

type LoanTimelineProps = {};

const now = new Date();

const LoanTimeline = ({
  loanId,
  activities = [],
  type,
  setType,
}: LoanTimelineProps) => {
  useEffect(() => {
    const el = document.getElementsByClassName('loan-timeline-timeline')[0];
    el.scrollLeft = el.scrollWidth;
  }, []);
  const elementAfterToday = activities.find(({ date }) => date.getTime() > now.getTime());

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
          onChange={(_, selected) => setType({ $in: selected })}
        />
      </div>
      <Timeline
        variant="horizontal"
        className="loan-timeline-timeline"
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
          mainLabel: <LoanTimelineTitle activity={activity} />,
          secondaryLabel: <LoanTimelineDescription activity={activity} />,
        }))}
      />
    </div>
  );
};

export default LoanTimelineContainer(LoanTimeline);
