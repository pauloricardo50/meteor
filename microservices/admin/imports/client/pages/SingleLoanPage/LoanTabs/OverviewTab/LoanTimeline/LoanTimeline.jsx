// @flow
import React, { useEffect } from 'react';

import Timeline from 'core/components/Timeline';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import LoanActivityAdder from './LoanActivityAdder';
import LoanTimelineContainer, {
  activityFilterOtions,
} from './LoanTimelineContainer';
import LoanTimelineTitle from './LoanTimelineTitle';
import LoanTimelineDescription from './LoanTimelineDescription';

type LoanTimelineProps = {};

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
  return (
    <div className="loan-timeline">
      <div className="flex">
        <h2>Activité</h2>
        <LoanActivityAdder loanId={loanId} />
        <Select
          value={type.$in}
          multiple
          label="Filtrer"
          options={activityFilterOtions.map(t => ({
            id: t,
            label: <T id={`Forms.type.${t}`} />,
          }))}
          onChange={(_, selected) => setType({ $in: selected })}
          renderValue={value =>
            (value.length > 1 ? 'Plusieurs' : <T id={`Forms.type.${value[0]}`} />)
          }
        />
      </div>
      <Timeline
        variant="horizontal"
        className="loan-timeline-timeline"
        events={activities.map(activity => ({
          mainLabel: <LoanTimelineTitle activity={activity} />,
          secondaryLabel: <LoanTimelineDescription activity={activity} />,
        }))}
      />
    </div>
  );
};

export default LoanTimelineContainer(LoanTimeline);
